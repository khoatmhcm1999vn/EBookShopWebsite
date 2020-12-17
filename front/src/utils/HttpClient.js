// import axios from "axios";
// import join from "url-join";
// import { server } from "../constants";

// const isAbsoluteURLRegex = /^(?:\w+:)\/\//;

// axios.interceptors.request.use(async (config) => {
//   if (!isAbsoluteURLRegex.test(config.url)) {
//     config.url = join("http://localhost:8090/api/v1/", config.url);
//   }

//   const userToken = localStorage.getItem(server.TOKEN_KEY);
//   if (userToken) {
//     config.headers = { "x-access-token": userToken };
//   }
//   config.timeout = 10000; // 10 Second
//   return config;
// });

// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     // debugger;
//     if (error.response.status == "401") {
//       const refreshToken = localStorage.getItem(server.REFRESH_TOKEN_KEY);
//       const refreshUrl = "http://localhost:8090/api/v1/REFRESH_TOKEN_KEY";
//       let result = await axios.post(refreshUrl, { refreshToken });

//       const token = result.data.jwt;
//       localStorage.setItem(server.TOKEN_KEY, token);
//       debugger;
//       return axios.request(error.config);
//     } else if (error.response.status == "403") {
//       // force logout
//       localStorage.removeItem(server.TOKEN_KEY);
//       localStorage.removeItem(server.REFRESH_TOKEN_KEY);
//     }

//     return Promise.reject(error);
//   }
// );

// export const httpClient = axios;

// import axios from "axios";
// import { api } from "../urlConfig";
// import store from "../store";
// import { authConstants } from "../actions/constants";

// const token = window.localStorage.getItem("token");

// const axiosIntance = axios.create({
//   baseURL: api,
//   headers: {
//     Authorization: token ? `Bearer ${token}` : "",
//   },
// });

// axiosIntance.interceptors.request.use((req) => {
//   const { auth } = store.getState();
//   if (auth.token) {
//     req.headers.Authorization = `Bearer ${auth.token}`;
//   }
//   return req;
// });

// axiosIntance.interceptors.response.use(
//   (res) => {
//     return res;
//   },
//   (error) => {
//     console.log(error.response);
//     const status = error.response ? error.response.status : 500;
//     if (status && status === 500) {
//       localStorage.clear();
//       store.dispatch({ type: authConstants.LOGOUT_SUCCESS });
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosIntance;
