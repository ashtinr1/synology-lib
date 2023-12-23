"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeDownload = exports.pauseDownload = exports.removeDownload = exports.download = exports.getDownloadsList = void 0;
const utils_1 = require("./utils");
async function getDownloadsList(baseUrl, offset, limit, _sid) {
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
exports.getDownloadsList = getDownloadsList;
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
    if (!response.success && response.error.code === 101) {
        throw new Error("download is already paused or the id is invalid");
    }
    throw new Error(`failed to pause download: ${id}`);
}
exports.pauseDownload = pauseDownload;
async function resumeDownload(baseUrl, id, _sid) {
    let url = (0, utils_1.buildUrl)({
        baseUrl,
        path: "DownloadStation/task.cgi",
        api: "SYNO.DownloadStation.Task",
        version: "1",
        method: "resume",
        options: {
            id,
            _sid
        }
    });
    let response = await fetch(url).then(resp => resp.json());
    if (response.success && (response.data[0].error === 0 || response.data[0].error === 405))
        return;
    if (!response.success && response.error.code === 105) {
        throw new Error("invalid sid");
    }
    if (response.success && (response.data[0].error === 405 || response.data[0].error === 544)) {
        throw new Error("download is already resumed or the id is invalid");
    }
    throw new Error(`failed to resume download: ${id}`);
}
exports.resumeDownload = resumeDownload;
