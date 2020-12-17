import { STAT_FETCHING, STAT_SUCCESS, STAT_FAILED, server } from "../constants";
import { httpClient } from "./../utils/HttpClient";

import axios from "axios";

import moment from "moment";

export const setSTATStateToFetching = () => ({
  type: STAT_FETCHING,
});

export const setSTATStateToFailed = () => ({
  type: STAT_FAILED,
});
export const setSTATStateToSuccess = (payload) => ({
  type: STAT_SUCCESS,
  payload,
});

export const getCurrentInventoryStat = () => {
  return async (dispatch) => {
    dispatch(setSTATStateToFetching());
    const response = await axios.get("http://localhost:8090/api/stat_product");
    let result = response.data.data.flat().map((item) => {
      return {
        createdAt: moment(item.createdAt).fromNow(),
        totalAmount: item.totalAmount,
      };
    });
    if (response.data.result === "success") {
      dispatch(setSTATStateToSuccess(result));
    } else if (response.data.result === "error") {
      dispatch(setSTATStateToFailed());
      return response.data.message;
    }
  };
};
