import {
  getJwtToken,
  getRefreshToken,
  saveJwtToken,
  saveRefreshToken
} from "../utils/cookie"
import { renewAccessToken } from "../config/axiosClient"

export const parseJwt = token => {
  var base64Url = token.split(".")[1]
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join("")
  )

  return JSON.parse(jsonPayload)
}

export const getCurrentUser = () => {
  return parseJwt(getJwtToken())
}

export const updateCookieToken = () => {
  const refreshToken = getRefreshToken()
  if (refreshToken) {
    renewAccessToken(refreshToken)
      .then(res => {
        const { access_token: newToken, refresh_token: newRefreshToken } = res
        saveJwtToken(newToken)
        saveRefreshToken(newRefreshToken)
      })
      .catch(err => {
        window.location.reload()
      })
  }
}
