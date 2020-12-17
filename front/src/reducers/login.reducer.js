// import { authConstants } from "../actions/constants";

// const initState = {
//   token: null,
//   user: {
//     name: "",
//     email: "",
//   },
//   authenticate: false,
//   authenticating: false,
//   loading: false,
//   error: null,
//   message: "",
// };

// export default (state = initState, action) => {
//   console.log(action);

//   switch (action.type) {
//     case authConstants.LOGIN_REQUEST:
//       state = {
//         ...state,
//         authenticating: true,
//       };
//       break;
//     case authConstants.LOGIN_SUCCESS:
//       state = {
//         ...state,
//         user: action.payload.user,
//         token: action.payload.token,
//         authenticate: true,
//         authenticating: false,
//       };
//       break;
//     case authConstants.LOGOUT_REQUEST:
//       state = {
//         ...state,
//         loading: true,
//       };
//       break;
//     case authConstants.LOGOUT_SUCCESS:
//       state = {
//         ...initState,
//       };
//       break;
//     case authConstants.LOGOUT_FAILURE:
//       state = {
//         ...state,
//         error: action.payload.error,
//         loading: false,
//       };
//       break;
//     default:
//   }

//   return state;
// };

import { LOGIN_FETCHING, LOGIN_FAILED, LOGIN_SUCCESS } from "../constants";

const initialState = {
  isFetching: false,
  isError: false,
  result: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_FETCHING:
      return { ...state, isFetching: true, isError: false, result: null };
    case LOGIN_FAILED:
      return { ...state, isFetching: false, isError: true, result: null };
    case LOGIN_SUCCESS:
      return { ...state, isFetching: false, isError: false, result: payload };

    default:
      return state;
  }
};
