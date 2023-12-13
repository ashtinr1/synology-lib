import { buildUrl } from "./utils"

interface IAuthenticateSuccess {
  data: {
    did: string
    sid: string
  }
  success: true
}

interface IAuthenticateError {
  error: {
    code: number
  }
  success: false
}

export async function authenticate(baseUrl: string, username: string, password: string): Promise<string> {
  let url = buildUrl({
    baseUrl,
    path: "auth.cgi",
    api: "SYNO.API.Auth",
    version: "3",
    method: "login",
    options: {
      account: username,
      passwd: password,
      session: "DownloadStation",
      format: "sid"
    }
  })

  let response: IAuthenticateSuccess | IAuthenticateError = await fetch(url).then(resp => resp.json())

  // guard clause, if the response was successful, return the sid. if the response was unsuccessful, continue.
  if (response.success) {
    return response.data.sid
  }

  // if the error code is 400, it means the credentials are invalid.
  if (response.error.code === 400) {
    throw new Error("invalid credentials")
  }

  // if the error code doesn't match any of the if statements above, throw a generic error.
  throw new Error("failed to authenticate")
}
