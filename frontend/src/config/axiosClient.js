import Axios from "axios";
import { getToken } from "../config/store.config";

const axiosClient = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
  },
});
axiosClient.interceptors.request.use((config) => {
  // const token = getState().auth.token;
  const token = getToken("token");
  // If token, add to headers
  if (token) {
    // config.headers.Authorization = "Bearer " + token;
    config.headers.Authorization = token;
  }
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

export default axiosClient;
