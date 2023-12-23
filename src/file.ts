import { buildUrl } from "./utils"

interface IGetFilesFromDirectorySuccess {
  data: {
    files: Array<{
      isdir: boolean
      name: string
      path: string
    }>
    offset: number
    total: number
  }
  success: true
}

interface IGetFilesFromDirectoryError {
  error: {
    code: number
  }
  success: false
}

export async function getFilesFromDirectory(baseUrl: string, folder_path: string, offset: number, limit: number, _sid: string) {
  let url = buildUrl({
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
  })

  let response: IGetFilesFromDirectorySuccess | IGetFilesFromDirectoryError = await fetch(url).then(resp => resp.json())

  if (response.success) {
    return response.data.files
  }

  if (response.error.code === 119) {
    throw new Error("invalid sid")
  }

  if (response.error.code === 408 || response.error.code === 401 || response.error.code === 418) {
    throw new Error("invalid path")
  }

  throw new Error("failed to get files")
}
