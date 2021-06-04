import { addressTypes } from "../constants/action.types"
import axiosClient from "../config/axiosClient"
import storeConfig from "../config/store.config"
import { toast } from "react-toastify"

const {
  ADDRESS_ADD_REQUEST,
  ADDRESS_ADD_SUCCESS,
  ADDRESS_ADD_FAIL,
  ADDRESS_ADD_RESET,
  ADDRESS_LIST_MY_REQUEST,
  ADDRESS_LIST_MY_SUCCESS,
  ADDRESS_LIST_MY_FAIL,
  ADDRESS_LIST_MY_RESET,
  ADDRESS_DELETE_REQUEST,
  ADDRESS_DELETE_SUCCESS,
  ADDRESS_DELETE_FAIL,
  ADDRESS_DELETE_RESET
} = addressTypes

export const saveAddressAction = payload => async dispatch => {
  let res
  try {
    dispatch({
      type: ADDRESS_ADD_REQUEST
    })

    // await saveAddressApi(addressRequestBody);
    // console.log(payload)
    // return
    res = await axiosClient.post("/api/address/user/address/create", payload)
    if (res.success) toast.success(res.message)
    else toast.error(res.message)
  } catch (error) {
    dispatch({
      type: ADDRESS_ADD_FAIL,
      payload: res.message
    })
  }
  dispatch({
    type: ADDRESS_ADD_SUCCESS
  })
  dispatch(getMyAddresesAction())
}

export const getMyAddresesAction = () => async dispatch => {
  let res
  try {
    dispatch({
      type: ADDRESS_LIST_MY_REQUEST
    })
    // const myAddressData = await getAllAddressesApi();
    res = await axiosClient.post("/api/address/user/getaddress")
  } catch (error) {
    dispatch({
      type: ADDRESS_LIST_MY_FAIL,
      payload: res.message
    })
  }
  dispatch({
    type: ADDRESS_LIST_MY_SUCCESS,
    payload: res.address
  })
}

export const deleteAddressAction = id => async dispatch => {
  let res
  try {
    dispatch({
      type: ADDRESS_DELETE_REQUEST
    })
    if (storeConfig.getLocalStorage("billAddressId")) {
      storeConfig.removeLocalStorage("billingAddressId")
      storeConfig.removeLocalStorage("shippingAddressId")
    }
    res = await axiosClient.post("/api/address/user/address/delete", {
      id
    })
    dispatch({
      type: ADDRESS_DELETE_SUCCESS
    })
    if (res.success) toast.success(res.message)
    dispatch(getMyAddresesAction())
  } catch (error) {
    toast.error(res.message)
    dispatch({
      type: ADDRESS_DELETE_FAIL,
      payload: res.message
    })
  }
}
