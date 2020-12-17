import {
  BRANCH_FETCHING,
  BRANCH_SUCCESS,
  BRANCH_FAILED,
  BRANCH_CLEAR,
  FETCHOPTION_SUCCESS,
} from "../constants";

import swal from "sweetalert";

import axios from "axios";

export const setBranchStateToFetching = () => ({
  type: BRANCH_FETCHING,
});

export const setBranchStateToFailed = () => ({
  type: BRANCH_FAILED,
});

export const setBranchStateToClear = () => ({
  type: BRANCH_CLEAR,
});

export const setBranchStateToSuccess = (payload) => ({
  type: BRANCH_SUCCESS,
  payload,
});

export const setFetchOptionStateToSuccess = (payload) => ({
  type: FETCHOPTION_SUCCESS,
  payload,
});

export const Index = () => {
  return async (dispatch) => {
    dispatch(setBranchStateToFetching());
    const response = await axios.get("http://localhost:8090/api/product");
    if (response.data.result === "success") {
      // console.log(response.data);
      dispatch(setBranchStateToSuccess(response.data.data));
    } else if (response.data.result === "error") {
      dispatch(setBranchStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};

export const getDropdownPOS = () => {
  return async (dispatch) => {
    dispatch(setBranchStateToFetching());
    const response = await axios.get(
      "http://localhost:8090/api/product_getcategory"
    );
    if (response.data.result === "success") {
      let result = response.data.data.flat().map((item) => {
        return {
          value: item._id,
          label: item.name,
        };
      });

      console.log(result);

      dispatch(setFetchOptionStateToSuccess(result));
    } else if (response.data.result === "error") {
      dispatch(setBranchStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};

export const getSingleBranch = (id) => {
  return async (dispatch) => {
    dispatch(setBranchStateToFetching());
    const response = await axios.get("http://localhost:8090/api/branch/" + id);
    console.log(response);

    // dispatch(getDropdownPOS()).then(() => {
    //   dispatch(setBranchStateToSuccess(response.data));
    // });

    if (response.data.result === "success") {
      dispatch(getDropdownPOS()).then(() => {
        dispatch(setBranchStateToSuccess(response.data.data));
      });
    } else if (response.data.result === "error") {
      dispatch(setBranchStateToFailed());
      swal("Error!", response.data.message, "error");
    }

    // if (response.data === "success") {

    // } else if (response.data.result === "error") {
    //   dispatch(setBranchStateToFailed());
    //   swal("Error!", response.data.message, "error");
    // }
  };
};

export const Create = (userId, token, values, history) => {
  return async (dispatch) => {
    dispatch(setBranchStateToFetching());
    const response = await axios.post(
      `http://localhost:8090/api/product/${userId}`,
      values,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.result === "success") {
      dispatch(setBranchStateToSuccess(response.data));
      swal("Success!", response.data.message, "success").then((value) => {
        dispatch(setBranchStateToClear());
        history.goBack();
        dispatch(Index());
      });
    } else if (response.data.result === "error") {
      dispatch(setBranchStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};

export const Update = (userId, token, values, history) => {
  return async (dispatch) => {
    dispatch(setBranchStateToFetching());
    const response = await axios.put(
      `http://localhost:8090/api/product/${userId}`,
      values,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.result === "success") {
      dispatch(setBranchStateToClear());
      history.goBack();
      dispatch(Index());
    } else if (response.data.result === "error") {
      dispatch(setBranchStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};

export const inline_update = (userId, token, values, history) => {
  return async (dispatch) => {
    // dispatch(setPOSMachineStateToFetching());
    const response = await axios.put(
      `http://localhost:8090/api/product/inline_update/${userId}`,
      values,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.result === "success") {
      // dispatch(setPOSMachineStateToClear());
    } else if (response.data.result === "error") {
      // dispatch(setPOSMachineStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};

export const Remove = (userId, token, id, history) => {
  return async (dispatch) => {
    console.log("remove");
    dispatch(setBranchStateToFetching());
    const response = await axios.delete(
      `http://localhost:8090/api/product/${userId}/${id}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.result === "success") {
      dispatch(setBranchStateToSuccess());
      history.push("/branch");
      dispatch(Index());
    } else if (response.data.result === "error") {
      dispatch(setBranchStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};

export const bulk_delete = (userId, token, id) => {
  console.log(id);
  return async (dispatch) => {
    console.log("remove");
    dispatch(setBranchStateToFetching());
    const response = await axios.delete(
      `http://localhost:8090/api/product/bulk_delete/${userId}/${id}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.result === "success") {
      dispatch(setBranchStateToSuccess());
      dispatch(Index());
    } else if (response.data.result === "error") {
      dispatch(setBranchStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};

export const clearState = () => {
  return (dispatch) => {
    dispatch(setBranchStateToClear());
  };
};
