interface IParameters {
  baseUrl: string
  path: string
  api: string
  version: string
  method: string
  options?: Record<string, string>
}

export function buildUrl(parameters: IParameters): string {
  let url = new URL(`${parameters.baseUrl}/webapi/${parameters.path}`)

  url.searchParams.append("api", parameters.api)
  url.searchParams.append("version", parameters.version)
  url.searchParams.append("method", parameters.method)

  Object.entries(parameters.options || {}).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  return url.href
}
