import Axios from "axios"
import {
  getRefreshToken,
  getToken,
  removeRefreshToken
} from "../config/store.config"
import store from "../store"
import { userTypes } from "../constants/action.types"
import {
  getJwtToken,
  removeJwtToken,
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
    // "content-type": "application/json",
    "Content-Type": "application/json",
    accept: "application/json"
  },
  withCredentials: true
})

axiosClient.interceptors.request.use(config => {
  // const token = getState().auth.token;
  const token = getJwtToken()
  // If token, add to headers
  if (token) {
    config.headers.Authorization = "Bearer " + token
    // config.headers.Authorization = token;
  }
  return config
})

// axiosClient.interceptors.response.use(
//   (response) => {
//     if (response && response.data) {
//       return response.data;
//     }
//     return response;
//   },
//   (error) => {
//     throw error;
//   }
// );
// const axiosInstance = Axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
//   timeout: 5000,
//   headers: {
//     Authorization: getToken() ? "Bearer " + getToken() : null,
//     "Content-Type": "application/json",
//     accept: "application/json",
//   },
// });

axiosClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        refreshTokenRequest =
          refreshTokenRequest || renewAccessToken(refreshToken)
        try {
          const { accessToken: newToken, refreshToken: newRefreshToken } =
            await refreshTokenRequest
          refreshTokenRequest = null

          const { config } = error
          config.headers.Authorization = `Bearer ${newToken}`
          saveJwtToken(newToken)
          saveRefreshToken(newRefreshToken)

          return axiosClient(config)
        } catch (err) {
          const { config } = error
          removeJwtToken()
          removeRefreshToken()
          window.location.reload()
        }
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient
