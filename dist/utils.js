"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUrl = void 0;
function buildUrl(parameters) {
    let url = new URL(`${parameters.baseUrl}/webapi/${parameters.path}`);
    url.searchParams.append("api", parameters.api);
    url.searchParams.append("version", parameters.version);
    url.searchParams.append("method", parameters.method);
    Object.entries(parameters.options || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });
    return url.href;
}
exports.buildUrl = buildUrl;
