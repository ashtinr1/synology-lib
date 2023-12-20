"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pauseDownload = exports.removeDownload = exports.download = exports.getDownloadList = void 0;
const utils_1 = require("./utils");
async function getDownloadList(baseUrl, offset, limit, _sid) {
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
exports.getDownloadList = getDownloadList;
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
async function removeDownload(baseUrl, id, _sid) {
    let url = (0, utils_1.buildUrl)({
        baseUrl,
        path: "DownloadStation/task.cgi",
        api: "SYNO.DownloadStation.Task",
        version: "1",
        method: "delete",
        options: {
            id,
            _sid
        }
    });
    let response = await fetch(url).then(resp => resp.json());
    if (response.success && response.data[0].error === 0)
        return;
    if (response.success && response.data[0].error === 544) {
        throw new Error(`id does not exist: ${response.data[0].id}`);
    }
    if (!response.success && response.error.code === 105) {
        throw new Error("invalid sid");
    }
    throw new Error(`failed to remove download: ${id}`);
}
exports.removeDownload = removeDownload;
async function pauseDownload(baseUrl, id, _sid) {
    let url = (0, utils_1.buildUrl)({
        baseUrl,
        path: "DownloadStation/task.cgi",
        api: "SYNO.DownloadStation.Task",
        version: "1",
        method: "pause",
        options: {
            id,
            _sid
        }
    });
    let response = await fetch(url).then(resp => resp.json());
    if (response.success && response.data[0].error === 0)
        return;
    if (!response.success && response.error.code === 105) {
        throw new Error("invalid sid");
    }
    throw new Error(`failed to pause download: ${id}`);
}
exports.pauseDownload = pauseDownload;
