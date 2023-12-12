import { buildUrl } from "./utils"

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

  if (response.success) {
    return
  }

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
