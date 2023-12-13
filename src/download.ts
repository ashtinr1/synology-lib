import { buildUrl } from "./utils"
import { ITask } from "./types"

interface IGetDownloadsSuccess {
  data: {
    offset: number
    tasks: Array<ITask>
    total: number
  }
  success: true
}

interface IGetDownloadsError {
  error: {
    code: number
  }
  success: false
}

export async function getDownloads(baseUrl: string, offset: number, limit: number, _sid: string): Promise<Array<ITask>> {
  let url = buildUrl({
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
  })

  let response: IGetDownloadsSuccess | IGetDownloadsError = await fetch(url).then(resp => resp.json())

  if (response.success) {
    return response.data.tasks
  }

  if (response.error.code === 105) {
    throw new Error("invalid sid")
  }

  throw new Error("failed to get downloads")
}

interface IDownloadSuccess {
  success: true
}

interface IDownloadError {
  error: {
    code: number
  }
  success: false
}

export async function download(baseUrl: string, uri: string, destination: string, _sid: string): Promise<void> {
  let url = buildUrl({
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
  })

  let response: IDownloadSuccess | IDownloadError = await fetch(url).then(resp => resp.json())

  if (response.success) return

  if (response.error.code === 105) {
    throw new Error("invalid sid")
  }

  if (response.error.code === 403) {
    throw new Error("invalid path")
  }

  if (response.error.code === 100) {
    throw new Error("invalid uri")
  }

  throw new Error("failed to queue download")
}
