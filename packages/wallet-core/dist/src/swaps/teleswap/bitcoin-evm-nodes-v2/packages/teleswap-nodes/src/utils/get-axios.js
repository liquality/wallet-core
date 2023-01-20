"use strict";
const axios = require('axios');
function getAxiosInstance({ baseUrl, timeout = 10000, headers = {}, auth, setManualTimeout = false, }) {
    let host = baseUrl;
    let requestAbort;
    let id;
    let instance;
    if (setManualTimeout) {
        requestAbort = axios.CancelToken.source();
        id = setTimeout(() => requestAbort.cancel(`timeout of ${timeout} ms. using request abort`), timeout + 100);
        instance = axios.create({
            baseURL: host,
            timeout,
            auth,
            headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
            cancelToken: requestAbort.token,
        });
    }
    else {
        instance = axios.create({
            baseURL: host,
            timeout,
            auth,
            headers: Object.assign({}, headers),
        });
    }
    instance.interceptors.response.use((response) => {
        if (setManualTimeout)
            clearTimeout(id);
        return response;
    }, (error) => {
        if (setManualTimeout)
            clearTimeout(id);
        if (error.response) {
            const serviceError = new Error(JSON.stringify(error.response.data));
            return Promise.reject(serviceError);
        }
        if (error.request) {
            const serviceError = new Error(error.message);
            return Promise.reject(serviceError);
        }
        return Promise.reject(error);
    });
    return instance;
}
module.exports = {
    getAxiosInstance,
};
//# sourceMappingURL=get-axios.js.map