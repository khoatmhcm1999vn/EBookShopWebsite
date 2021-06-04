import {
  BOOK_FETCHING,
  BOOK_SUCCESS,
  BOOK_FAILED,
  BOOK_CLEAR,
  FETCHOPTION_SUCCESS
} from "../constants/bookConstants"
import swal from "sweetalert"
import { toast } from "react-toastify"
import AxiosClient from "../config/axiosClient"
import Axios from "axios"

export const setBookStateToFetching = () => ({
  type: BOOK_FETCHING
})
export const setBookStateToSuccess = payload => ({
  type: BOOK_SUCCESS,
  payload
})
export const setBookStateToFailed = () => ({
  type: BOOK_FAILED
})
export const setBookStateToClear = () => ({
  type: BOOK_CLEAR
})
export const setFetchOptionStateToSuccess = payload => ({
  type: FETCHOPTION_SUCCESS,
  payload
})

export const Index = () => {
  return async dispatch => {
    dispatch(setBookStateToFetching())
    const response = await Axios.post("http://localhost:8090/api/getAllBook")
    if (response.data.result === "success") {
      dispatch(setBookStateToSuccess(response.data.data))
    } else if (response.data.result === "error") {
      dispatch(setBookStateToFailed())
      swal("Error!", response.data.message, "error")
    }
  }
}
export const SearchName = params => {
  return async dispatch => {
    dispatch(setBookStateToFetching())
    console.log(params)
    const response = await Axios.get("http://localhost:8090/api/product", {
      params
    })
    if (response.data.result === "success") {
      dispatch(setBookStateToSuccess(response.data.data))
    } else if (response.data.result === "error") {
      dispatch(setBookStateToFailed())
      swal("Error!", response.data.message, "error")
    }
  }
}
export const getDropdownPOS = () => {
  return async dispatch => {
    dispatch(setBookStateToFetching())
    const response = await AxiosClient.get("/api/product_getcategory")
    if (response.result === "success") {
      let result = response.data.flat().map(item => {
        return {
          value: item._id,
          label: item.name
        }
      })
      console.log(result)
      dispatch(setFetchOptionStateToSuccess(result))
    } else if (response.result === "error") {
      dispatch(setBookStateToFailed())
      swal("Error!", response.message, "error")
    }
  }
}
export const getSingleBook = id => {
  return async dispatch => {
    dispatch(setBookStateToFetching())
    const response = await AxiosClient.get("/api/branch/" + id)
    console.log(response)
    // dispatch(getDropdownPOS()).then(() => {
    //   dispatch(setBranchStateToSuccess(response.data));
    // });
    if (response.result === "success") {
      dispatch(getDropdownPOS()).then(() => {
        dispatch(setBookStateToSuccess(response))
      })
    } else if (response.result === "error") {
      dispatch(setBookStateToFailed())
      swal("Error!", response.message, "error")
    }
    // if (response.data === "success") {
    // } else if (response.data.result === "error") {
    //   dispatch(setBranchStateToFailed());
    //   swal("Error!", response.data.message, "error");
    // }
  }
}

export const Create = (values, history) => {
  return async dispatch => {
    dispatch(setBookStateToFetching())
    const response = await AxiosClient.post(`/api/upload`, values)
    console.log(response)
    if (response.result === "success") {
      dispatch(setBookStateToSuccess(response))
      swal("Success!", response.message, "success").then(value => {
        dispatch(setBookStateToClear())
        history.goBack()
        dispatch(Index())
      })
    } else if (response.result === "error") {
      dispatch(setBookStateToFailed())
      swal("Error!", response.message, "error")
    }
  }
}
export const Update = (values, history) => {
  return async dispatch => {
    dispatch(setBookStateToFetching())
    const response = await AxiosClient.put(`/api/uploadx1`, values)
    if (response.result === "success") {
      dispatch(setBookStateToClear())
      history.goBack()
      dispatch(Index())
    } else if (response.result === "error") {
      dispatch(setBookStateToFailed())
      swal("Error!", response.message, "error")
    }
  }
}
export const inline_update = (values, history) => {
  return async dispatch => {
    // dispatch(setBookStateToFetching());
    // console.log(values);
    const response = await AxiosClient.put(`/admin/book/inline_update`, values)
    console.log(response)
    if (response.message === "Update Product data Successfully") {
      // dispatch(setBookStateToClear());
      // dispatch(Index());
    } else if (response.result === "error") {
      dispatch(setBookStateToFailed())
      swal("Error!", response.message, "error")
    }
  }
}
export const Remove = (id, history) => {
  return async dispatch => {
    console.log("remove")
    // dispatch(setBookStateToFetching());
    let res
    try {
      res = await await AxiosClient.get(`/admin/deactivatebook/${id}`)
      if (res.success) toast.success(res.message)
      else toast.error(res.message)
    } catch (err) {
      toast.error(res.message)
      console.log(err)
      return
    }
    dispatch(Index())
  }
}
export const bulk_delete = id => {
  console.log(id)
  return async dispatch => {
    console.log("remove")
    dispatch(setBookStateToFetching())
    const response = await AxiosClient.delete(`/book/bulk_delete/${id}`)
    if (response.result === "success") {
      dispatch(setBookStateToSuccess())
      dispatch(Index())
    } else if (response.result === "error") {
      dispatch(setBookStateToFailed())
      swal("Error!", response.message, "error")
    }
  }
}
export const clearState = () => {
  return dispatch => {
    dispatch(setBookStateToClear())
  }
}
