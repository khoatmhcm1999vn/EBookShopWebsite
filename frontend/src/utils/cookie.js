import cookie from "js-cookie"

const cookieConfig = {
  path: "/",
  sameSite: "Lax",
  expires: 30
}

export const setCookieData = (key, value) => {
  cookie.set(key, value, cookieConfig)
}

export const saveJwtToken = token => {
  setCookieData("access-token", token)
}

export const saveRefreshToken = token => {
  setCookieData("refresh-token", token)
}

export const saveDeviceToken = token => {
  setCookieData("device-token", token)
}

export const getJwtToken = () => {
  return cookie.get("access-token")
}

export const getRefreshToken = () => {
  return cookie.get("refresh-token")
}

export const getDeviceToken = () => {
  return cookie.get("device-token")
}

export const removeJwtToken = () => {
  return cookie.remove("access-token")
}

export const removeRefreshToken = () => {
  return cookie.remove("refresh-token")
}

export const removeDeviceToken = () => {
  return cookie.remove("device-token")
}

export const removeLocalStorageField = field => {
  return localStorage.removeItem(field)
}

export const isExpiredToken = () => !getJwtToken()
