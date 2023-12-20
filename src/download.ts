import { buildUrl } from "./utils"
import { ITask } from "./types"

interface IGetDownloadListSuccess {
  data: {
    offset: number
    tasks: Array<ITask>
    total: number
  }
  success: true
}

interface IGetDownloadListError {
  error: {
    code: number
  }
  success: false
}

export async function getDownloadList(baseUrl: string, offset: number, limit: number, _sid: string): Promise<Array<ITask>> {
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

  let response: IGetDownloadListSuccess | IGetDownloadListError = await fetch(url).then(resp => resp.json())

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

interface IRemoveDownloadSuccess {
  data: Array<{
    error: number
    id: string
  }>
  success: true
}

interface IRemoveDownloadError {
  error: {
    code: number
  }
  success: false
}

export async function removeDownload(baseUrl: string, id: string, _sid: string): Promise<void> {
  let url = buildUrl({
    baseUrl,
    path: "DownloadStation/task.cgi",
    api: "SYNO.DownloadStation.Task",
    version: "1",
    method: "delete",
    options: {
      id,
      _sid
    }
  })

  let response: IRemoveDownloadSuccess | IRemoveDownloadError = await fetch(url).then(resp => resp.json())

  if (response.success && response.data[0].error === 0) return

  if (response.success && response.data[0].error === 544) {
    throw new Error(`id does not exist: ${response.data[0].id}`)
  }

  if (!response.success && response.error.code === 105) {
    throw new Error("invalid sid")
  }

  throw new Error(`failed to remove download: ${id}`)
}

interface IPauseDownloadSuccess {
  data: Array<{
    error: number
    id: string
  }>
  success: true
}

interface IPauseDownloadError {
  error: {
    code: number
  }
  success: false
}

export async function pauseDownload(baseUrl: string, id: string, _sid: string): Promise<void> {
  let url = buildUrl({
    baseUrl,
    path: "DownloadStation/task.cgi",
    api: "SYNO.DownloadStation.Task",
    version: "1",
    method: "pause",
    options: {
      id,
      _sid
    }
  })

  let response: IPauseDownloadSuccess | IPauseDownloadError = await fetch(url).then(resp => resp.json())

  if (response.success && response.data[0].error === 0) return

  if (!response.success && response.error.code === 105) {
    throw new Error("invalid sid")
  }

  throw new Error(`failed to pause download: ${id}`)
}
