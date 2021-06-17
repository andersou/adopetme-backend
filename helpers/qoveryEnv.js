function setQoveryEnv() {
    if (process.env.QOVERY_ROUTER_MAIN_ADOPETME_BACKEND_URL) {
        process.env.BACKEND_URL = process.env.QOVERY_ROUTER_MAIN_ADOPETME_BACKEND_URL
    }
    if (process.env.QOVERY_ROUTER_MAIN_ADOPETME_FRONTEND_URL) {
        process.env.FRONTEND_URL = process.env.QOVERY_ROUTER_MAIN_ADOPETME_FRONTEND_URL

    }
}
module.exports = setQoveryEnv