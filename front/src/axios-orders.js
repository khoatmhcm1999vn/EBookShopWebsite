import axios from "axios";

const instance = axios.create({
  // baseURL: 'https://test-2de45.firebaseio.com/'
  baseURL: "http://localhost:8090/api",
  headers: {
    "Content-type": "application/json",
  },
});

export default instance;
