/* eslint-disable */
;(function (window) {
    const config = {
        environment: "local",
        app_name: "Démo Faro",
        app_version: "1.0.0",
        apm: {
            enabled: true,
            url: "https://faro-collector-prod-eu-west-2.grafana.net/collect/<YOUR_API_KEY>",
        },
    }
    window.config = window.config || config
})(this)
/* eslint-enable */