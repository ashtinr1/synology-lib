"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByKeyword = void 0;
const utils_1 = require("./utils");
async function searchByKeyword(baseUrl, keyword, offset, limit, _sid) {
    let url = (0, utils_1.buildUrl)({
        baseUrl,
        path: "DownloadStation/btsearch.cgi",
        api: "SYNO.DownloadStation.BTSearch",
        version: "1",
        method: "start",
        options: {
            keyword,
            _sid
        }
    });
    let response = await fetch(url).then(resp => resp.json());
    if (response.success) {
        return await _resolveTaskid(baseUrl, response.data.taskid, offset, limit, _sid);
    }
    if (response.error.code === 105) {
        throw new Error("invalid sid");
    }
    throw new Error(`failed to search for '${keyword}'`);
}
exports.searchByKeyword = searchByKeyword;
async function _resolveTaskid(baseUrl, taskid, offset, limit, _sid) {
    let url = (0, utils_1.buildUrl)({
        baseUrl,
        path: "DownloadStation/btsearch.cgi",
        api: "SYNO.DownloadStation.BTSearch",
        version: "1",
        method: "list",
        options: {
            taskid,
            offset: String(offset),
            limit: String(limit),
            sort_by: "seeds",
            sort_direction: "DESC",
            _sid
        }
    });
    let response = await fetch(url).then(resp => resp.json());
    while (response.success && response.data.items.length < limit) {
        response = await fetch(url).then(resp => resp.json());
        await new Promise(r => setTimeout(r, 2500));
    }
    if (response.success) {
        await _cleanTaskid(baseUrl, taskid, _sid);
        return response.data.items;
    }
    throw new Error(`failed to resolve taskid: '${taskid}'`);
}
async function _cleanTaskid(baseUrl, taskid, _sid) {
    let url = (0, utils_1.buildUrl)({
        baseUrl,
        path: "DownloadStation/btsearch.cgi",
        api: "SYNO.DownloadStation.BTSearch",
        version: "1",
        method: "clean",
        options: {
            taskid,
            _sid
        }
    });
    let response = await fetch(url).then(resp => resp.json());
    if (!response.success) {
        throw new Error(`failed to clean taskid: '${taskid}'`);
    }
}
