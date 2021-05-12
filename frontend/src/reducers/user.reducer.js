import { userTypes } from "../constants/action.types";
import { userConstants } from "../constants/userConstants";
import { USER_SIGNOUT } from "../constants/userConstants";
import { combineReducers } from "redux";
import { getToken } from "../config/store.config";

const initial = {
  email: null,
  islogin: false,
  data: [],
  page: 1,
  totalpage: null,
  currentUser: null,
  loading_user: false,
  address: [],
  error: null,
  loading: false,
  success: true,
};

const user = (
  // state = {
  //   data: [],
  //   page: 1,
  //   totalpage: null,
  // },
  state = initial,
  action
) => {
  switch (action.type) {
    case userTypes.SET_USER: {
      return {
        ...state,
        data: action.data,
      };
    }
    case userTypes.ADD_USER_SUCCESS: {
      return {
        ...state,
        isadd: true,
      };
    }
    case userTypes.ADD_USER_FAIL: {
      return {
        ...state,
        isadd: false,
      };
    }
    case userTypes.UPDATE_USER_SUCCESS: {
      return {
        ...state,
        isupdate: true,
      };
    }
    case userTypes.RESET_USER: {
      return {
        ...state,
        isadd: null,
        isupdate: null,
      };
    }
    case "SET_CURRENT_USER": {
      return {
        ...state,
        loading_user: false,
        currentUser: action.payload,
      };
    }
    case "LOADING_USER": {
      return {
        ...state,
        loading_user: true,
      };
    }
    case "LOADED_USER": {
      return {
        ...state,
        loading_user: false,
        currentUser: {
          ...state.currentUser,
          token: getToken("token"),
          user: action.payload,
        },
      };
    }
    case userTypes.SET_EMAIL_LOGIN: {
      return {
        ...state,
        email: action.email,
      };
    }
    case userTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        islogin: true,
        // loading_user: false,
        currentUser: {
          ...state.currentUser,
          token: getToken("token"),
          user: action.payload,
        },
      };
    }
    case userTypes.LOGIN_FAIL: {
      return {
        ...state,
        islogin: false,
        currentUser: null,
      };
    }
    case USER_SIGNOUT:
      return {};
    case userTypes.RESET_IS_LOGIN:
      return {
        ...state,
        islogin: null,
      };
    case userTypes.SET_PAGE: {
      return {
        ...state,
        page: action.page,
      };
    }
    case userTypes.SET_TOTAL_PAGE: {
      return {
        ...state,
        totalpage: action.totalpage,
      };
    }

    case userConstants.GET_USER_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.GET_USER_ADDRESS_SUCCESS:
      return {
        ...state,
        address: action.payload,
        loading: false,
      };
    case userConstants.GET_USER_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case userConstants.ADD_USER_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.ADD_USER_ADDRESS_SUCCESS:
      return {
        ...state,
        address: action.payload.address,
        loading: false,
      };
    case userConstants.ADD_USER_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case userConstants.ADDRESS_DELETE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.ADDRESS_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case userConstants.ADDRESS_DELETE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case userConstants.ADDRESS_DELETE_RESET:
      return {};
    default: {
      return state;
    }
  }
};

const forgotPassword = (state = {}, action) => {
  switch (action.type) {
    case userTypes.FORGOT_EMAIL_SUCCESS: {
      return {
        ...state,
        isForgot: true,
      };
    }
    case userTypes.FORGOT_EMAIL_FAIL: {
      return {
        ...state,
        isForgot: false,
      };
    }
    case userTypes.SET_EMAIL_FORGOTPASSWORD: {
      return {
        ...state,
        email: action.email,
      };
    }
    case userTypes.VERIFY_OTP_SUCCESS: {
      return {
        ...state,
        verify_otp: true,
        otp: action.otp,
      };
    }
    case userTypes.VERIFY_OTP_FAIL: {
      return {
        ...state,
        verify_otp: false,
      };
    }
    case userTypes.FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        forgotpassword: true,
      };
    }
    case userTypes.FORGOT_PASSWORD_FAIL: {
      return {
        ...state,
        forgotpassword: false,
      };
    }
    case userTypes.RESET_FORGOT_PASSWORD: {
      return {};
    }
    default:
      return state;
  }
};

export default combineReducers({
  user,
  forgotPassword,
});
