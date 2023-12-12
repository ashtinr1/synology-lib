import { buildUrl } from "./utils"
import { ITorrent } from "./types"

interface ISearchByKeywordSuccess {
  data: {
    taskid: string
  }
  success: true
}

interface ISearchByKeywordError {
  error: {
    code: number
  }
  success: false
}

export async function searchByKeyword(baseUrl: string, keyword: string, offset: number, limit: number, _sid: string): Promise<Array<ITorrent>> {
  let url = buildUrl({
    baseUrl,
    path: "DownloadStation/btsearch.cgi",
    api: "SYNO.DownloadStation.BTSearch",
    version: "1",
    method: "start",
    options: {
      keyword,
      _sid
    }
  })

  let response: ISearchByKeywordSuccess | ISearchByKeywordError = await fetch(url).then(resp => resp.json())

  if (response.success) {
    return await _resolveTaskid(baseUrl, response.data.taskid, offset, limit, _sid)
  }

  if (response.error.code === 105) {
    throw new Error("invalid sid")
  }

  throw new Error(`failed to search for '${keyword}'`)
}

interface IResolveTaskidSuccess {
  data: {
    finished: boolean
    items: Array<ITorrent>
    offset: number
    total: number
  }
  success: true
}

interface IResolveTaskidError {
  error: {
    code: number
  }
  success: false
}

async function _resolveTaskid(baseUrl: string, taskid: string, offset: number, limit: number, _sid: string): Promise<Array<ITorrent>> {
  let url = buildUrl({
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
  })

  let response: IResolveTaskidSuccess | IResolveTaskidError = await fetch(url).then(resp => resp.json())

  while (response.success && response.data.items.length < limit) {
    response = await fetch(url).then(resp => resp.json())
    await new Promise(r => setTimeout(r, 2500))
  }

  if (response.success) {
    await _cleanTaskid(baseUrl, taskid, _sid)
    return response.data.items
  }

  throw new Error(`failed to resolve taskid: '${taskid}'`)
}

interface ICleanTaskidSuccess {
  success: true
}

interface ICleanTaskidError {
  error: {
    code: number
  }
  success: false
}

async function _cleanTaskid(baseUrl: string, taskid: string, _sid: string): Promise<void> {
  let url = buildUrl({
    baseUrl,
    path: "DownloadStation/btsearch.cgi",
    api: "SYNO.DownloadStation.BTSearch",
    version: "1",
    method: "clean",
    options: {
      taskid,
      _sid
    }
  })

  let response: ICleanTaskidSuccess | ICleanTaskidError = await fetch(url).then(resp => resp.json())

  if (!response.success) {
    throw new Error(`failed to clean taskid: '${taskid}'`)
  }
}
