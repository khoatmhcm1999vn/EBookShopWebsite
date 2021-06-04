import {
  BILL_FETCHING,
  BILL_SUCCESS,
  BILL_FAILED,
  BILL_CLEAR
} from "../constants/billConstants"
import swal from "sweetalert"
import AxiosClient from "../config/axiosClient"
import Axios from "axios"

export const setBillStateToFetching = () => ({
  type: BILL_FETCHING
})
export const setBillStateToSuccess = payload => ({
  type: BILL_SUCCESS,
  payload
})
export const setBillStateToFailed = () => ({
  type: BILL_FAILED
})
export const setBillStateToClear = () => ({
  type: BILL_CLEAR
})

export const Index = () => {
  return async dispatch => {
    dispatch(setBillStateToFetching())
    const response = await Axios.get("http://localhost:8090/api/bill")
    if (response.data.result === "success") {
      dispatch(setBillStateToSuccess(response.data.data))
    } else if (response.data.result === "error") {
      dispatch(setBillStateToFailed())
      swal("Error!", response.data.message, "error")
    }
  }
}
export const SearchName = params => {
  return async dispatch => {
    dispatch(setBillStateToFetching())
    console.log(params)
    const response = await Axios.get("http://localhost:8090/api/bill", {
      params
    })
    if (response.data.result === "success") {
      dispatch(setBillStateToSuccess(response.data.data))
    } else if (response.data.result === "error") {
      dispatch(setBillStateToFailed())
      swal("Error!", response.data.message, "error")
    }
  }
}

export const inline_update = (values, history) => {
  return async dispatch => {
    // dispatch(setBookStateToFetching());
    // console.log(values);
    const response = await AxiosClient.put(`/admin/bill/inline_update`, values)
    console.log(response)
    if (response.message === "Update Product data Successfully") {
      // dispatch(setBookStateToClear());
      // dispatch(Index());
    } else if (response.result === "error") {
      dispatch(setBillStateToFailed())
      swal("Error!", response.message, "error")
    }
  }
}
export const Remove = (id, history) => {
  return async dispatch => {
    console.log("remove")
    dispatch(setBillStateToFetching())
    const response = await AxiosClient.delete(`/api/product/${id}`)
    if (response.result === "success") {
      dispatch(setBillStateToSuccess())
      history.push("/product")
      dispatch(Index())
    } else if (response.result === "error") {
      dispatch(setBillStateToFailed())
      swal("Error!", response.message, "error")
    }
  }
}
export const bulk_delete = (token, id) => {
  console.log(id)
  return async dispatch => {
    console.log("remove")
    dispatch(setBillStateToFetching())
    const response = await AxiosClient.delete(`/api/product/bulk_delete/${id}`)
    if (response.result === "success") {
      dispatch(setBillStateToSuccess())
      dispatch(Index())
    } else if (response.result === "error") {
      dispatch(setBillStateToFailed())
      swal("Error!", response.message, "error")
    }
  }
}
export const clearState = () => {
  return dispatch => {
    dispatch(setBillStateToClear())
  }
}
