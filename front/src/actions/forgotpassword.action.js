import { FORGOT_FETCHING, FORGOT_SUCCESS, FORGOT_FAILED } from "../constants";
import swal from "sweetalert";

import { httpClient } from "./../utils/HttpClient";
import axios from "axios";

export const setForgotStateToFetching = () => ({
  type: FORGOT_FETCHING,
});

export const setForgotStateToFailed = () => ({
  type: FORGOT_SUCCESS,
});

export const setForgotStateToSuccess = (payload) => ({
  type: FORGOT_FAILED,
  payload,
});

export const forgotpassword = (values, history) => {
  return async (dispatch) => {
    dispatch(setForgotStateToFetching());
    const response = await axios.post(
      "http://localhost:8090/api/password/reset",
      values
    );
    if (response.data.result === "success") {
      dispatch(setForgotStateToSuccess(response.data));
      swal("Success!", response.data.message, "warning").then((value) => {
        history.push("/login");
      });
    } else if (response.data.result === "error") {
      swal("Error!", response.data.message, "error");
    }
  };
};
