import {
  SUPPLIER_FETCHING,
  SUPPLIER_SUCCESS,
  SUPPLIER_FAILED,
  SUPPLIER_CLEAR,
} from "../constants";

import swal from "sweetalert";

import axios from "axios";

export const setSupplierStateToFetching = () => ({
  type: SUPPLIER_FETCHING,
});

export const setSupplierStateToFailed = () => ({
  type: SUPPLIER_FAILED,
});

export const setSupplierStateToClear = () => ({
  type: SUPPLIER_CLEAR,
});

export const setSupplierStateToSuccess = (payload) => ({
  type: SUPPLIER_SUCCESS,
  payload,
});

export const Index = (token) => {
  return async (dispatch) => {
    dispatch(setSupplierStateToFetching());
    // const response = await axios.get("http://localhost:8090/api/categories");
    // console.log(response.data);

    const response = await fetch(`http://localhost:8090/api/categories`, {
      method: "GET",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));

    dispatch(setSupplierStateToSuccess(response));
    console.log(response);

    // if (response.data.result === "success") {
    //   // console.log(response.data);
    //   dispatch(setSupplierStateToSuccess(response.data.data));
    // } else if (response.data.result === "error") {
    //   dispatch(setSupplierStateToFailed());
    //   swal("Error!", response.data.message, "error");
    // }
  };
};

export const Create = (userId, token, values, history) => {
  return async (dispatch) => {
    dispatch(setSupplierStateToFetching());
    const response = await axios.post(
      `http://localhost:8090/api/category/create/${userId}`,
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
      dispatch(setSupplierStateToSuccess(response.data));
      swal("Success!", response.data.message, "success").then((value) => {
        dispatch(setSupplierStateToClear());
        history.goBack();
        dispatch(Index());
      });
    } else if (response.data.result === "error") {
      dispatch(setSupplierStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};

export const getSingleSupplier = (id) => {
  return async (dispatch) => {
    dispatch(setSupplierStateToFetching());
    const response = await axios.get(
      "http://localhost:8090/api/category/" + id
    );
    if (response.data.result === "success") {
      dispatch(setSupplierStateToSuccess(response.data.data));
    } else if (response.data.result === "error") {
      dispatch(setSupplierStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};

export const Update = (userId, token, values, history) => {
  return async (dispatch) => {
    dispatch(setSupplierStateToFetching());
    const response = await axios.put(
      `http://localhost:8090/api/category/update/${userId}`,
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
      dispatch(setSupplierStateToClear());
      history.goBack();
      dispatch(Index());
    } else if (response.data.result === "error") {
      dispatch(setSupplierStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};

export const Remove = (userId, token, id, history) => {
  return async (dispatch) => {
    console.log("remove");
    dispatch(setSupplierStateToFetching());
    const response = await axios.delete(
      `http://localhost:8090/api/category/delete/${userId}/${id}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.result === "success") {
      dispatch(setSupplierStateToSuccess());
      history.push("/supplier");
      dispatch(Index());
    } else if (response.data.result === "error") {
      dispatch(setSupplierStateToFailed());
      swal("Error!", response.data.message, "error");
    }
  };
};
