"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.getDownloads = void 0;
const utils_1 = require("./utils");
async function getDownloads(baseUrl, offset, limit, _sid) {
    let url = (0, utils_1.buildUrl)({
        baseUrl,
        path: "DownloadStation/task.cgi",
        api: "SYNO.DownloadStation.Task",
        version: "1",
        method: "list",
        options: {
            offset: String(offset),
            limit: String(limit),
            _sid
        }
    });
    let response = await fetch(url).then(resp => resp.json());
    if (response.success) {
        return response.data.tasks;
    }
    if (response.error.code === 105) {
        throw new Error("invalid sid");
    }
    throw new Error("failed to get downloads");
}
exports.getDownloads = getDownloads;
async function download(baseUrl, uri, destination, _sid) {
    let url = (0, utils_1.buildUrl)({
        baseUrl,
        path: "DownloadStation/task.cgi",
        api: "SYNO.DownloadStation.Task",
        version: "1",
        method: "create",
        options: {
            uri,
            destination,
            _sid
        }
    });
    let response = await fetch(url).then(resp => resp.json());
    if (response.success)
        return;
    if (response.error.code === 105) {
        throw new Error("invalid sid");
    }
    if (response.error.code === 403) {
        throw new Error("invalid path");
    }
    if (response.error.code === 100) {
        throw new Error("invalid uri");
    }
    throw new Error("failed to queue download");
}
exports.download = download;
