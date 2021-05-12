import { cartTypes } from "../constants/action.types";
import {
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_EMPTY,
} from "../constants/cartConstants";
// import { combineReducers } from "redux";

export const cartReducer = (
  state = { data: [], city: [], district: [], ward: [] },
  // state = { data: [] },
  action
) => {
  switch (action.type) {
    case cartTypes.SET_CART: {
      return {
        ...state,
        data: action.data,
      };
    }

    case cartTypes.SET_CITY: {
      return {
        ...state,
        city: action.data,
      };
    }
    case cartTypes.SET_DICTRICT: {
      return {
        ...state,
        district: action.data,
      };
    }
    case cartTypes.SET_WARD: {
      return {
        ...state,
        ward: action.data,
      };
    }

    case CART_SAVE_SHIPPING_ADDRESS:
      return { ...state, shippingAddress: action.payload };
    case CART_SAVE_PAYMENT_METHOD:
      return { ...state, paymentMethod: action.payload };
    case CART_EMPTY:
      return { ...state, error: "", data: [] };

    case cartTypes.PAYMENT_SUCCESS: {
      return {
        ...state,
        ispay: true,
      };
    }
    case cartTypes.PAYMENT_FAIL: {
      return {
        ...state,
        ispay: false,
      };
    }
    case cartTypes.RESET_PAYMENT: {
      return {
        ...state,
        ispay: null,
      };
    }
    default:
      return state;
  }
};
// export default combineReducers({
//   cart,
// });
