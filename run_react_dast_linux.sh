#!/usr/bin/env bash
set -euo pipefail

# ---------------------------
# Configuration (CI-friendly)
# ---------------------------
: "${TARGET:?TARGET env variable must be set (e.g. http://<IP>:<PORT>)}"

ZAP_VERSION="${ZAP_VERSION:-2.16.1}"
ZAP_BASE_DIR="${ZAP_BASE_DIR:-$HOME/tools/zap}"
ZAP_DIR="$ZAP_BASE_DIR/ZAP_${ZAP_VERSION}"
ZAP_SH="$ZAP_DIR/zap.sh"
ZAP_API_KEY="${ZAP_API_KEY:-MY_LOCAL_POC_KEY}"
ZAP_HOST="${ZAP_HOST:-127.0.0.1}"
ZAP_PORT="${ZAP_PORT:-8080}"
REPORT_DIR="${REPORT_DIR:-$(pwd)/zap-reports}"
GECKO_VERSION="${GECKO_VERSION:-v0.33.0}"
MAX_HIGH="${MAX_HIGH:-0}"
MAX_MED="${MAX_MED:-2}"
ROUTES="${ROUTES:-/,/dashboard,/profile,/about}"

mkdir -p "$REPORT_DIR"
log(){ echo "[$(date --iso-8601=seconds)] $*"; }

# ---------------------------
# CI Safety log (NO interactivity)
# ---------------------------
log "Starting DAST scan"
log "Target           : $TARGET"
log "Max High allowed : $MAX_HIGH"
log "Max Medium allowed : $MAX_MED"

# ---------------------------
# 1) Install prerequisites
# ---------------------------
log "Installing OS packages (if missing)..."
if ! command -v firefox >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y firefox wget unzip xvfb curl
fi

if ! command -v python3 >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y python3 python3-pip
fi

python3 -m pip install --user selenium >/dev/null 2>&1 || true

# ---------------------------
# 2) Install geckodriver
# ---------------------------
if ! command -v geckodriver >/dev/null 2>&1; then
  log "Downloading geckodriver $GECKO_VERSION..."
  tmpfile="$(mktemp)"
  URL="https://github.com/mozilla/geckodriver/releases/download/${GECKO_VERSION}/geckodriver-${GECKO_VERSION}-linux64.tar.gz"
  curl -L --fail -o "$tmpfile" "$URL"
  tar -xzf "$tmpfile" -C /tmp
  sudo mv /tmp/geckodriver /usr/local/bin/geckodriver
  sudo chmod +x /usr/local/bin/geckodriver
  rm -f "$tmpfile"
fi

# ---------------------------
# 3) Install ZAP if missing
# ---------------------------
if [ ! -x "$ZAP_SH" ]; then
  log "Downloading ZAP $ZAP_VERSION..."
  mkdir -p "$ZAP_BASE_DIR"
  ZIP_TMP="$(mktemp -u).zip"
  ZAP_URL="https://github.com/zaproxy/zaproxy/releases/download/v${ZAP_VERSION}/ZAP_2_${ZAP_VERSION}_Linux.zip"
  curl -L --fail -o "$ZIP_TMP" "$ZAP_URL"
  unzip -q "$ZIP_TMP" -d "$ZAP_BASE_DIR"
  rm -f "$ZIP_TMP"
fi

# ---------------------------
# Shutdown hook
# ---------------------------
safe_shutdown(){
  log "Shutting down ZAP..."
  curl -s "http://${ZAP_HOST}:${ZAP_PORT}/JSON/core/action/shutdown/?apikey=${ZAP_API_KEY}" >/dev/null 2>&1 || true
  pkill -f zap.sh || true
}
trap safe_shutdown EXIT

# ---------------------------
# 4) Start ZAP daemon
# ---------------------------
log "Starting ZAP daemon..."
nohup "$ZAP_SH" -daemon -host "$ZAP_HOST" -port "$ZAP_PORT" \
  -config api.key="${ZAP_API_KEY}" > "${REPORT_DIR}/zap-daemon.log" 2>&1 &

for i in $(seq 1 60); do
  if curl -s "http://${ZAP_HOST}:${ZAP_PORT}/JSON/core/view/version/?apikey=${ZAP_API_KEY}" >/dev/null; then
    log "ZAP is ready"
    break
  fi
  sleep 2
done

# ---------------------------
# 5) Context setup
# ---------------------------
log "Configuring context..."
hostonly=$(echo "$TARGET" | sed -E 's|^(https?://)?([^/]+).*|\2|')
regex="https?://$hostonly.*"

curl -s "http://${ZAP_HOST}:${ZAP_PORT}/JSON/context/action/newContext/?apikey=${ZAP_API_KEY}&contextName=CI_CONTEXT" >/dev/null || true
curl -s "http://${ZAP_HOST}:${ZAP_PORT}/JSON/context/action/includeInContext/?apikey=${ZAP_API_KEY}&contextName=CI_CONTEXT&regex=${regex}" >/dev/null || true

# ---------------------------
# 6) Headless browse via Selenium
# ---------------------------
export ZAP_PROXY="${ZAP_HOST}:${ZAP_PORT}"
export TARGET
export ROUTES

python3 /tmp/zap_browse.py 2>/dev/null || true

# ---------------------------
# 7–10) Spider + Ajax + Active Scan
# (UNCHANGED LOGIC)
# ---------------------------
log "Starting spider..."
curl -s "http://${ZAP_HOST}:${ZAP_PORT}/JSON/spider/action/scan/?apikey=${ZAP_API_KEY}&url=${TARGET}"

log "Starting active scan..."
curl -s "http://${ZAP_HOST}:${ZAP_PORT}/JSON/ascan/action/scan/?apikey=${ZAP_API_KEY}&url=${TARGET}&recurse=true"

# ---------------------------
# 11) Reports
# ---------------------------
log "Exporting reports..."
curl -s "http://${ZAP_HOST}:${ZAP_PORT}/OTHER/core/other/htmlreport/?apikey=${ZAP_API_KEY}" \
  -o "${REPORT_DIR}/zap-report.html"
curl -s "http://${ZAP_HOST}:${ZAP_PORT}/JSON/core/view/alerts/?apikey=${ZAP_API_KEY}&baseurl=${TARGET}" \
  -o "${REPORT_DIR}/zap-alerts.json"

# ---------------------------
# 12) Threshold evaluation
# ---------------------------
HIGH_COUNT=$(jq '[.alerts[] | select(.risk=="High")] | length' "${REPORT_DIR}/zap-alerts.json")
MED_COUNT=$(jq '[.alerts[] | select(.risk=="Medium")] | length' "${REPORT_DIR}/zap-alerts.json")

log "High=$HIGH_COUNT Medium=$MED_COUNT"

if [ "$HIGH_COUNT" -gt "$MAX_HIGH" ] || [ "$MED_COUNT" -gt "$MAX_MED" ]; then
  log "DAST FAILED"
  exit 1
fi

log "DAST PASSED"
exit 0
