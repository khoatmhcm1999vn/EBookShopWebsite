import {
  REGISTER_FETCHING,
  REGISTER_FAILED,
  REGISTER_SUCCESS,
  server,
} from "../constants";
import swal from "sweetalert";
import { httpClient } from "./../utils/HttpClient";

import axios from "axios";

export const setRegisterStateToFetching = () => ({
  type: REGISTER_FETCHING,
});

export const setRegisterStateToFailed = () => ({
  type: REGISTER_FAILED,
});

export const setRegisterStateToSuccess = (payload) => ({
  type: REGISTER_SUCCESS,
  payload,
});

export const register = (values, history) => {
  return async (dispatch) => {
    dispatch(setRegisterStateToFetching());
    const response = await axios.post(
      "http://localhost:8090/api/admin/signup",
      values
    );
    console.log(response);
    if (response.data.result === "success") {
      dispatch(setRegisterStateToSuccess(response.data));
      swal("Success!", response.data.message, "warning").then((value) => {
        history.push("/login");
      });
    } else if (response.data.result === "error") {
      dispatch(setRegisterStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};
