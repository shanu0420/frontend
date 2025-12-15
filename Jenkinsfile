@Library('Shared-Library@react-ci-shanu') _

properties([
    parameters([
        booleanParam(
            name: 'RUN_BUILD',
            defaultValue: true,
            description: 'Run React code compilation'
        ),
        booleanParam(
            name: 'RUN_DAST',
            defaultValue: true,
            description: 'Run DAST scan'
        ),
        string(
            name: 'DAST_TARGET_URL',
            defaultValue: 'http://43.205.90.157:3000',
            description: 'Target URL for DAST scan'
        ),
        string(
            name: 'DAST_EMAIL',
            defaultValue: 'downtimerakshak@gmail.com',
            description: 'Email for DAST notifications'
        )
    ])
])

node {

    if (params.RUN_BUILD) {
        reactCodeCompilation()
    }

    if (params.RUN_DAST) {
        reactZapDast(
            targetUrl: params.DAST_TARGET_URL,
            emailTo : params.DAST_EMAIL
        )
    }
}
