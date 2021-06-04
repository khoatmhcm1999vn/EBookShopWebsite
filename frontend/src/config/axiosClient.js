import Axios from "axios"
import { getToken } from "../config/store.config"
import store from "../store"
import { userTypes } from "../constants/action.types"

const axiosClient = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    // "content-type": "application/json",
    "Content-Type": "application/json",
    accept: "application/json"
  }
})

axiosClient.interceptors.request.use(config => {
  // const token = getState().auth.token;
  const token = getToken()
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
  response => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  error => {
    const originalRequest = error.config
    console.log(originalRequest.url)
    console.log(error.response.data.message)
    console.log(error.response.status)

    // Prevent infinite loops
    if (
      error.response.status === 401
      // originalRequest.url.includes("grant_type=refresh_token")
    ) {
      localStorage.clear()
      store.dispatch({
        type: userTypes.USER_LOGOUT
      })
      document.location.href = "/login_register"
      return Promise.reject(error)
    }

    if (
      // error.response.data.message === "Your session is not valid." &&
      error.response.status === 401
      // error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem("refresh_token")
      // console.log("Refreshing Token " + refreshToken);

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]))
        // console.log(tokenParts);

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000)

        if (tokenParts.exp > now) {
          console.log("Refresh token is expired", tokenParts.exp, now)
          return Axios.post(
            `${process.env.REACT_APP_API_URL}/user/token?grant_type=refresh_token&refresh_token=${refreshToken}`,
            {}
          )
            .then(response => {
              localStorage.setItem("access_token", response.data.access_token)
              localStorage.setItem("refresh_token", response.data.refresh_token)
              Axios.defaults.headers["Authorization"] =
                "Bearer " + response.data.access_token
              // Axios.headers["Authorization"] =
              //   "Bearer " + response.data.access_token;
              originalRequest.headers["Authorization"] =
                "Bearer " + response.data.access_token
              return Axios(originalRequest)
            })
            .catch(err => {
              console.error(
                "Error while getting token using refresh token.",
                err
              )
            })
        } else {
          // console.log("Refresh token is expired", tokenParts.exp, now);
          localStorage.clear()
          store.dispatch({
            type: userTypes.USER_LOGOUT
          })
          document.location.href = "/login_register"
        }
      } else {
        // console.log("Refresh token not available.");
        localStorage.clear()
        store.dispatch({
          type: userTypes.USER_LOGOUT
        })
        document.location.href = "/login_register"
      }
    }
    // specific error handling done elsewhere
    return Promise.reject(error)
  }
)
export default axiosClient
