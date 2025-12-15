@Library('Shared-Library@react-ci-shanu') _

properties([
    parameters([
        booleanParam(name: 'RUN_BUILD', defaultValue: true, description: 'Run React build'),
        booleanParam(name: 'RUN_DAST',  defaultValue: true, description: 'Run DAST scan')
    ])
])

node {
    if (params.RUN_BUILD) {
        reactCodeCompilation()
    }

    if (params.RUN_DAST) {
        reactZapDast(
            targetUrl: 'http://43.205.90.157:3000',
            emailTo : 'downtimerakshak@gmail.com'
        )
    }
}
