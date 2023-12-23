"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesFromDirectory = void 0;
const utils_1 = require("./utils");
async function getFilesFromDirectory(baseUrl, folder_path, offset, limit, _sid) {
    let url = (0, utils_1.buildUrl)({
        baseUrl,
        path: "entry.cgi",
        api: "SYNO.FileStation.List",
        version: "2",
        method: "list",
        options: {
            folder_path,
            offset: String(offset),
            limit: String(limit),
            sort_by: "crtime",
            sort_direction: "DESC",
            _sid
        }
    });
    let response = await fetch(url).then(resp => resp.json());
    if (response.success) {
        return response.data.files;
    }
    if (response.error.code === 119) {
        throw new Error("invalid sid");
    }
    if (response.error.code === 408 || response.error.code === 401 || response.error.code === 418) {
        throw new Error("invalid path");
    }
    throw new Error("failed to get files");
}
exports.getFilesFromDirectory = getFilesFromDirectory;
