import {
  LOGIN_FETCHING,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  server,
} from "../constants";

import { httpClient } from "../utils/HttpClient";

import axios from "axios";

import jwt from "jsonwebtoken";
import swal from "sweetalert";

export const setLoginStateToFetching = () => ({
  type: LOGIN_FETCHING,
});

export const setLoginStateToFailed = () => ({
  type: LOGIN_FAILED,
});

export const setLoginStateToSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
});

// Called by Login Component
export const signin = (value, history) => {
  // console.log(value);
  return async (dispatch) => {
    try {
      dispatch(setLoginStateToFetching()); // fetching
      let result = await axios.post(
        "http://localhost:8090/api/admin/signin",
        value
      );
      console.log(result.data.result);

      if (result.data.result === "success") {
        const { token, refreshToken } = result.data.token;
        // const {payload} = result.data.payload;
        // console.log(token);

        localStorage.setItem(server.TOKEN_KEY, JSON.stringify(result.data));
        // localStorage.setItem("user", payload);
        // localStorage.setItem(server.REFRESH_TOKEN_KEY, refreshToken);
        dispatch(setLoginStateToSuccess(result.data));
        swal("Success!", result.data.message, "success").then((value) => {});
        console.log("success");
        history.push("/dashboard");
      } else {
        swal("Error!", result.data.message, "error").then((value) => {});
        dispatch(setLoginStateToFailed(result));
      }
    } catch (error) {
      swal("Error!", error.message, "error").then((value) => {});
      dispatch(setLoginStateToFailed({ data: { message: error } }));
    }
  };
};

export const isLoggedIn = () => {
  if (typeof window === "undefined") {
    return false;
  }
  if (localStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }

  // if (token) {
  //   var decodedToken = jwt.decode(token, { complete: true });
  //   var dateNow = new Date();

  //   if (decodedToken.exp < dateNow.getTime()) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // } else {
  //   return false;
  // }
};

export const getcurrentRole = () => {
  let token = localStorage.getItem(server.TOKEN_KEY);
  // var base64Url = token.split(".")[1];
  // var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  // var jsonPayload = decodeURIComponent(
  //   atob(base64)
  //     .split("")
  //     .map(function (c) {
  //       return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  //     })
  //     .join("")
  // );
  let { level } = JSON.parse(token);
  return level;
};
