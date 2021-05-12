import axios from "axios";
import axiosClient from "../config/axiosClient";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { userTypes } from "../constants/action.types";
import { getCart } from "../actions/cart.action";
import { USER_SIGNOUT, userConstants } from "../constants/userConstants";
import storeConfig from "../config/store.config";
export const setUser = (data) => ({
  type: userTypes.SET_USER,
  data,
});
export const getUser = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.get(
      "/admin/getAllUser/" + getState().userReducers.user.page
    );
  } catch (err) {
    console.log(err);
    return;
  }
  dispatch(setUser(res.data));
  dispatch(setTotalPage(res.totalPage));
};
export const setTotalPage = (totalpage) => ({
  type: userTypes.SET_TOTAL_PAGE,
  totalpage,
});
export const setPage = (page) => ({
  type: userTypes.SET_PAGE,
  page,
});
export const nextPage = () => (dispatch, getState) => {
  let page = getState().userReducers.user.page;
  let totalpage = getState().userReducers.user.totalpage;
  if (page < totalpage) {
    dispatch(setPage(parseInt(page) + 1));
  }
};
export const backPage = () => (dispatch, getState) => {
  let page = getState().userReducers.user.page;
  if (page > 1) {
    dispatch(setPage(parseInt(page) - 1));
  }
};

export const deleteUser = (email) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/deleteuser/", {
      email: email,
    });
    if (res.result === "success") {
      swal("Success!", res.message, "success");
    } else if (res.result === "error") {
      swal("Error!", res.message, "error");
    }
  } catch (err) {
    swal("Error!", res.message, "error");
    console.log(err);
    return;
  }
  dispatch(getUser());
};
export const deactivateUser = (email) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/deactivateuser/", {
      email: email,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    console.log(err);
    return;
  }
  dispatch(getUser());
};

export const addUserSuccess = () => ({
  type: userTypes.ADD_USER_SUCCESS,
});
export const addUserFail = () => ({
  type: userTypes.ADD_USER_FAIL,
});
export const updateUserSuccess = () => ({
  type: userTypes.UPDATE_USER_SUCCESS,
});
export const updateUserFail = () => ({
  type: userTypes.UPDATE_USER_FAIL,
});
export const resetUser = () => ({
  type: userTypes.RESET_USER,
});
export const addUser =
  (
    email,
    password,
    firstName,
    lastName,
    // address,
    phone_number,
    is_admin
  ) =>
  async (dispatch, getState) => {
    dispatch(resetUser());
    let res;
    try {
      res = await axiosClient.post("/admin/adduser", {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        // address: address,
        phone_number: phone_number,
        is_admin: is_admin,
      });
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    } catch (err) {
      console.log(err);
      toast.error(res.message);
      dispatch(addUserFail());
      return;
    }
    dispatch(addUserSuccess());
    dispatch(getUser());
  };
export const updateUser =
  (
    email,
    firstName,
    lastName,
    // address,
    phone_number,
    is_admin
  ) =>
  async (dispatch, getState) => {
    let res;
    try {
      res = await axiosClient.post("/admin/updateuser", {
        email: email,
        firstName: firstName,
        lastName: lastName,
        // address: address,
        phone_number: phone_number,
        is_admin: is_admin,
      });
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    } catch (err) {
      console.log(err);
      toast.error(res.message);
      dispatch(updateUserFail());
      return;
    }
    dispatch(updateUserSuccess());
    dispatch(getUser());
  };

export const setCurrentUser = (user) => {
  return {
    type: "SET_CURRENT_USER",
    payload: user,
  };
};

export const loginSuccess = (token, user) => async (dispatch, getState) => {
  storeConfig.setUser(user);
  storeConfig.setToken(token);
  // dispatch(setCurrentUser(user));
  dispatch(setLoginSuccess(user));

  let cart = storeConfig.getCart();
  storeConfig.removeCart();
  if (cart !== null) {
    // let res;
    try {
      await axiosClient.post("/cart/addtocard", {
        id_user: user.id,
        products: cart,
      });
      dispatch(getCart());
    } catch (err) {
      console.log(JSON.stringify(err.response));
      return;
    }
  }
};
export const setLoginSuccess = (user) => ({
  type: userTypes.LOGIN_SUCCESS,
  // data: "login success",
  payload: user,
});
export const setLoginFail = () => ({
  type: userTypes.LOGIN_FAIL,
  data: "login fail",
});

export const resetIsLogin = () => ({
  type: userTypes.RESET_IS_LOGIN,
});

export const setEmail = (email) => ({
  type: userTypes.SET_EMAIL_LOGIN,
  email,
});

export const logout = () => (dispatch, getState) => {
  // console.log("logout ");
  // storeConfig.clear();
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");
  localStorage.removeItem("cart");
  localStorage.removeItem("shippingAddress");
  dispatch({ type: USER_SIGNOUT });
  document.location.href = "/login_register";
  // dispatch(setLoginFail());
};

export const forgotEmailSuccess = () => ({
  type: userTypes.FORGOT_EMAIL_SUCCESS,
});
export const forgotEmailFail = () => ({
  type: userTypes.FORGOT_EMAIL_FAIL,
});
export const resetForgotPassword = () => ({
  type: userTypes.RESET_FORGOT_PASSWORD,
});
export const setEmailForgotPassword = (email) => ({
  type: userTypes.SET_EMAIL_FORGOTPASSWORD,
  email,
});
export const submitForgotPassword = (email) => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/request/forgotpassword/${email}`
    );
    // if (res.data.result === "success") {
    //   swal("Success!", res.data.message, "success");
    // } else if (res.data.result === "error") {
    //   swal("Error!", res.data.message, "error");
    // }
  } catch (err) {
    // swal("Error!", res.data.message, "error");
    dispatch(forgotEmailFail());
    return;
  }
  dispatch(setEmailForgotPassword(res.data.email));
  dispatch(forgotEmailSuccess());
};
export const submitOTP = (otp) => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/verify/forgotpassword`,
      {
        email: getState().userReducers.forgotPassword.email,
        otp: otp,
      }
    );
    // if (res.data.result === "success") {
    //   swal("Success!", res.data.message, "success");
    // } else if (res.data.result === "error") {
    //   swal("Error!", res.data.message, "error");
    // }
  } catch (err) {
    // swal("Error!", res.data.message, "error");
    dispatch(verifyOTPFAIL());
    return;
  }
  dispatch(verifyOTPSuccess(otp));
};
export const verifyOTPSuccess = (otp) => ({
  type: userTypes.VERIFY_OTP_SUCCESS,
  otp,
});
export const verifyOTPFAIL = () => ({
  type: userTypes.VERIFY_OTP_FAIL,
});

export const submitEnterNewPassword =
  (newPassword) => async (dispatch, getState) => {
    let res;
    try {
      res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/forgotpassword`,
        {
          email: getState().userReducers.forgotPassword.email,
          otp: getState().userReducers.forgotPassword.otp,
          newPassword: newPassword,
        }
      );
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    } catch (err) {
      toast.error(res.message);
      dispatch(forgotPasswordFail());
      return;
    }
    dispatch(forgotPasswordSuccess());
  };

export const forgotPasswordSuccess = () => ({
  type: userTypes.FORGOT_PASSWORD_SUCCESS,
});
export const forgotPasswordFail = () => ({
  type: userTypes.FORGOT_PASSWORD_FAIL,
});

export const loadedUser = (user) => {
  return {
    type: "LOADED_USER",
    payload: user,
  };
};
export const loadUser = (refHistory) => async (dispatch, getState) => {
  // user_loading
  // dispatch({ type: "LOADING_USER" });
  // const token = getState().auth.token
  // axiosClient
  //   .get(`/me`)
  //   .then((data) => {
  //     // console.log(data)
  //     if (!data.success) {
  //       removeLocalStorage("token");
  //       refHistory.replace("/login_register");
  //       dispatch(loadedUser(null));
  //       return;
  //     }
  //     console.log(data.user);
  //     dispatch(loadedUser(data.user));
  //   })
  //   .catch(() => {
  //     // refHistory.replace('/login')
  //   });
  if (storeConfig.getUser() === null) {
    dispatch(setLoginFail());
    return false;
  }
  let res;
  try {
    res = await axiosClient.get("/me");
    console.log(res);
    if (!res.success) {
      storeConfig.removeLocalStorage("token");
      // refHistory.replace("/login_register");
      dispatch(setLoginFail());
      return false;
    }
  } catch (err) {
    dispatch(setLoginFail());
    return false;
  }
  dispatch(setLoginSuccess(res.user));
  return res.user;
};
export const auth = () => async (dispatch, getState) => {
  if (storeConfig.getUser() === null) {
    dispatch(setLoginFail());
    return false;
  }
  let email = storeConfig.getUser().email;
  let token = storeConfig.getToken();
  console.log(email);
  let res;
  try {
    res = await axios.post(`${process.env.REACT_APP_API_URL}/auth`, {
      email: email,
      token: token,
    });
    // console.log(res)
  } catch (err) {
    dispatch(setLoginFail());
    return false;
  }
  dispatch(setLoginSuccess());
  return true;
};

export const getAddress = () => {
  return async (dispatch) => {
    try {
      const res = await axiosClient.post(`/api/address/user/getaddress`);
      dispatch({ type: userConstants.GET_USER_ADDRESS_REQUEST });
      console.log(res.success);
      if (res.success) {
        const {
          userAddress: { ward, district, address, city, user, _id },
        } = res;
        dispatch({
          type: userConstants.GET_USER_ADDRESS_SUCCESS,
          payload: { ward, district, address, city, user, _id },
        });
      } else {
        const { error } = res;
        dispatch({
          type: userConstants.GET_USER_ADDRESS_FAILURE,
          payload: { error },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};
export const addAddress = (payload) => {
  return async (dispatch) => {
    try {
      console.log(payload);
      // return
      const res = await axiosClient.post(`/api/address/user/address/create`, {
        payload,
      });

      dispatch({ type: userConstants.ADD_USER_ADDRESS_REQUEST });
      if (res.success) {
        console.log(res);
        // return;
        const { addressFind } = res;
        dispatch({
          type: userConstants.ADD_USER_ADDRESS_SUCCESS,
          payload: { addressFind },
        });
      } else {
        const { error } = res;
        dispatch({
          type: userConstants.ADD_USER_ADDRESS_FAILURE,
          payload: { error },
        });
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(getAddress());
  };
};
export const deleteAddress = (id) => async (dispatch) => {
  let res;
  try {
    dispatch({
      type: userConstants.ADDRESS_DELETE_REQUEST,
    });
    if (storeConfig.getLocalStorage("billAddressId")) {
      storeConfig.removeLocalStorage("billingAddressId");
      storeConfig.removeLocalStorage("shippingAddressId");
    }
    res = await axiosClient.post("/api/address/user/address/delete", {
      id,
    });
    dispatch({
      type: userConstants.ADDRESS_DELETE_SUCCESS,
    });
    if (res.success) toast.success(res.message);
    dispatch(getAddress());
  } catch (error) {
    toast.error(res.message);
    dispatch({
      type: userConstants.ADDRESS_DELETE_FAILURE,
      payload: res.message,
    });
  }
};
