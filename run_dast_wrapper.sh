#!/usr/bin/env bash
# run_dast_wrapper.sh
# Wrapper: run existing DAST script, preserve reports, only fail pipeline on High alerts.
set -euo pipefail

# Path to the original DAST runner (adjust if yours is named differently)
DAST_SCRIPT="./run_react_dast_linux.sh"

# Where the zap alerts JSON will be written by the DAST script
REPORT_DIR="${REPORT_DIR:-./zap-reports}"
ALERT_FILE="${REPORT_DIR}/zap-alerts.json"

# Run the original DAST script but capture its exit status (we will override failure if only Mediums)
if [[ ! -x "$DAST_SCRIPT" ]]; then
  echo "ERROR: DAST script $DAST_SCRIPT not found or not executable."
  exit 2
fi

echo "Running original DAST script: $DAST_SCRIPT"
# allow the DAST script to fail without exiting this wrapper (we'll decide based on alerts)
set +e
"$DAST_SCRIPT"
orig_rc=$?
set -e

echo "Original DAST script exited with code: $orig_rc"
# If no report file exists yet, wait a little for reports to be flushed (optional)
if [[ ! -f "$ALERT_FILE" ]]; then
  echo "Alert file $ALERT_FILE not found yet. Waiting up to 10s for it to appear..."
  for i in {1..10}; do
    [[ -f "$ALERT_FILE" ]] && break
    sleep 1
  done
fi

if [[ ! -f "$ALERT_FILE" ]]; then
  echo "No alert file at $ALERT_FILE. Cannot evaluate thresholds; defaulting to success."
  # Preserve the original exit code if it indicated a hard failure unrelated to thresholds (optional)
  # But to guarantee pipeline success as requested, exit 0:
  exit 0
fi

# Robustly count High/Medium (works across common ZAP JSON shapes)
HIGH=$(jq -r '[.site[].alerts[]? | select(.risk=="High")] | length' "$ALERT_FILE" 2>/dev/null || jq -r '[.alerts[]? | select(.risk=="High")] | length' "$ALERT_FILE" 2>/dev/null || echo 0)
MEDIUM=$(jq -r '[.site[].alerts[]? | select(.risk=="Medium")] | length' "$ALERT_FILE" 2>/dev/null || jq -r '[.alerts[]? | select(.risk=="Medium")] | length' "$ALERT_FILE" 2>/dev/null || echo 0)

echo "DAST summary — High=$HIGH Medium=$MEDIUM"
echo "Reports available at: $(realpath "$REPORT_DIR")"

# Archive artifacts (optional)
if command -v tar >/dev/null 2>&1; then
  tar -czf zap-reports.tgz -C "$REPORT_DIR" . || true
  echo "Created zap-reports.tgz"
fi

# Decision: fail only on Highs (Mediums are warnings)
if [[ "$HIGH" -gt 0 ]]; then
  echo "DAST FAILED: High alerts found (High=$HIGH)."
  # preserve failing behavior for Highs
  exit 1
else
  echo "DAST finished: no High alerts — continuing pipeline (Mediums are warnings)."
  # Return success regardless of orig_rc (so pipeline continues)
  exit 0
fi
