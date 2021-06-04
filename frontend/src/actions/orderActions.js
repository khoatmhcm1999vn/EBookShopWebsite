import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_PAY_REQUEST,
  ORDER_PAY_FAIL,
  ORDER_PAY_SUCCESS,
  ORDER_MINE_LIST_REQUEST,
  ORDER_MINE_LIST_FAIL,
  ORDER_MINE_LIST_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_SUMMARY_REQUEST,
  ORDER_SUMMARY_SUCCESS
} from "../constants/orderConstants"
// import { getErrorMessage } from "../service/CommonUtils";
// import {
//   getAllMyOrdersApi,
//   previewOrderApi,
//   placeOrderApi,
//   getOrderApi,
//   getAllOrdersApi,
// } from "../service/RestApiCalls";

import { CART_EMPTY } from "../constants/cartConstants"
import AxiosClient from "../config/axiosClient"

export const createOrder = order => async (dispatch, getState) => {
  dispatch({ type: ORDER_CREATE_REQUEST, payload: order })
  let res

  // console.log(order);

  try {
    // const {
    //   userSignin: { userInfo },
    // } = getState();
    res = await AxiosClient.post("/bill/create", order)
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: res.order })
    dispatch({ type: CART_EMPTY })
    // localStorage.removeItem("cart");
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const saveBillingAddressIdToLocalStorage =
  billingAddressId => dispatch => {
    dispatch({
      type: "ORDER_SAVE_SHIPPING_ADDRESS",
      payload: billingAddressId
    })
    localStorage.setItem("billingAddressId", billingAddressId)
  }
export const saveShippingAddressIdToLocalStorage =
  shippingAddressId => dispatch => {
    dispatch({
      type: "ORDER_SAVE_BILLING_ADDRESS",
      payload: shippingAddressId
    })
    localStorage.setItem("shippingAddressId", shippingAddressId)
  }
export const savePaymentMethodIdToLocalStorage =
  paymentMethodId => dispatch => {
    dispatch({
      type: "ORDER_SAVE_PAYMENT_METHOD",
      payload: paymentMethodId
    })
    localStorage.setItem("paymentMethodId", paymentMethodId)
  }

export const detailsOrder = orderId => async (dispatch, getState) => {
  dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId })
  // const {
  //   userSignin: { userInfo },
  // } = getState();
  try {
    const res = await AxiosClient.get(`/bill/${orderId}`)
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: res })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    dispatch({ type: ORDER_DETAILS_FAIL, payload: message })
  }
}
export const payOrder =
  (order, paymentResult) => async (dispatch, getState) => {
    // const {
    //   userSignin: { userInfo },
    // } = getState();
    // console.log(paymentResult);
    // alert("success");
    // return;
    const singleOrder = order[0]
    dispatch({
      type: ORDER_PAY_REQUEST,
      payload: { singleOrder, paymentResult }
    })
    let res
    try {
      res = await AxiosClient.put(`/bill/${singleOrder._id}/pay`, paymentResult)
      // console.log(res.order);
      dispatch({ type: ORDER_PAY_SUCCESS, payload: res.order })
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      dispatch({ type: ORDER_PAY_FAIL, payload: message })
    }
  }
export const deliverOrder = orderId => async (dispatch, getState) => {
  dispatch({ type: ORDER_DELIVER_REQUEST, payload: orderId })
  // const {
  //   userSignin: { userInfo },
  // } = getState();
  try {
    const res = AxiosClient.put(`/api/orders/${orderId}/deliver`)
    dispatch({ type: ORDER_DELIVER_SUCCESS, payload: res })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    dispatch({ type: ORDER_DELIVER_FAIL, payload: message })
  }
}

export const summaryOrder = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_SUMMARY_REQUEST })
  // const {
  //   userSignin: { userInfo },
  // } = getState();
  try {
    const res = await AxiosClient.post("/api/bills/summary")
    // console.log(res);
    dispatch({ type: ORDER_SUMMARY_SUCCESS, payload: res })
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}
