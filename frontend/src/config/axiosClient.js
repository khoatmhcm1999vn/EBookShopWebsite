import Axios from "axios"

import {
  getJwtToken,
  getRefreshToken,
  saveJwtToken,
  saveRefreshToken
} from "../utils/cookie"

let refreshTokenRequest = null

export const renewAccessToken = async refreshToken => {
  const { data } = await axiosClient.post(
    `${process.env.REACT_APP_API_URL}/user/token?grant_type=refresh_token&refresh_token=${refreshToken}`,
    {}
  )
  return data
}

const axiosClient = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json"
  }
})

axiosClient.interceptors.request.use(config => {
  const token = getJwtToken()
  // If token, add to headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      const refreshToken = getRefreshToken()

      if (refreshToken) {
        refreshTokenRequest =
          refreshTokenRequest || renewAccessToken(refreshToken)
        try {
          const { access_token: newToken, refresh_token: newRefreshToken } =
            await refreshTokenRequest
          refreshTokenRequest = null

          const { config } = error
          config.headers.Authorization = `Bearer ${newToken}`
          saveJwtToken(newToken)
          saveRefreshToken(newRefreshToken)

          return axiosClient(config)
        } catch (err) {
          const { config } = error
          //removeJwtToken()
          //removeRefreshToken()
          window.location.reload()
        }
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient
