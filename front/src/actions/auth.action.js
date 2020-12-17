import { authConstants, cartConstants } from "./constants";
// import axios from "../utils/HttpClient";

import axios from "axios";

// new update signup action
// export const signup = (user) => {
//   return async (dispatch) => {
//     try {
//       dispatch({ type: authConstants.SIGNUP_REQUEST });
//       const res = await axios.post(`/admin/signup`, user);
//       if (res.status === 201) {
//         dispatch({ type: authConstants.SIGNUP_SUCCESS });
//         const { token, user } = res.data;
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         dispatch({
//           type: authConstants.LOGIN_SUCCESS,
//           payload: {
//             token,
//             user,
//           },
//         });
//       } else {
//         dispatch({ type: authConstants.SIGNUP_FAILURE });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };

// export const login = (user) => {
//   console.log(user);

//   return async (dispatch) => {
//     dispatch({ type: authConstants.LOGIN_REQUEST });
//     const res = await axios.post(`/admin/signin`, {
//       ...user,
//     });

//     console.log(res);

//     if (res.status === 200) {
//       const { token, user } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       dispatch({
//         type: authConstants.LOGIN_SUCCESS,
//         payload: {
//           token,
//           user,
//         },
//       });
//     } else {
//       if (res.status === 400) {
//         dispatch({
//           type: authConstants.LOGIN_FAILURE,
//           payload: { error: res.data.error },
//         });
//       }
//     }
//   };
// };

export const isUserLoggedIn = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: {
          token,
          user,
        },
      });
    } else {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { error: "Failed to login" },
      });
    }
  };
};

export const signout = () => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGOUT_REQUEST });
    const res = await axios.post(`http://localhost:8090/api/admin/signout`);

    if (res.status === 200) {
      localStorage.clear();
      dispatch({ type: authConstants.LOGOUT_SUCCESS });
      dispatch({ type: cartConstants.RESET_CART });
    } else {
      dispatch({
        type: authConstants.LOGOUT_FAILURE,
        payload: { error: res.data.error },
      });
    }

    // dispatch({ type: authConstants.LOGOUT_REQUEST });
    // // localStorage.removeItem('user');
    // // localStorage.removeItem('token');
    // const res = await axios.post(`/admin/signout`);
    // localStorage.clear();
    // dispatch({ type: authConstants.LOGOUT_SUCCESS });
    // dispatch({ type: cartConstants.RESET_CART });
    //const res = await axios.post(`/admin/signout`);
    // if(res.status === 200){

    // }else{
    //     dispatch({
    //         type: authConstants.LOGOUT_FAILURE,
    //         payload: { error: res.data.error }
    //     });
    // }
  };
};
