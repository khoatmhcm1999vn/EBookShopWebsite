import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

import bookReducers from "./reducers/book.reducer";
import bookReducer from "./reducers/bookReducers";
import billReducer from "./reducers/billReducers";
import userReducers from "./reducers/user.reducer";
import homeReducers from "./reducers/home.reducer";
import productReducers from "./reducers/product.reducer";
import profileReducers from "./reducers/profile.reducer";
import { cartReducer } from "./reducers/cart.reducer";
import purchaseReducers from "./reducers/purchase.reducer";
import {
  addressSaveReducer,
  addressListMyReducer,
  addressDeleteReducer,
} from "./reducers/address.reducer";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderDeliverReducer,
  orderPayReducer,
  orderSummaryReducer,
} from "./reducers/orderReducers";
import {
  paymentMethodListMyReducer,
  paymentMethodSaveReducer,
} from "./reducers/paymentReducers";

const initialState = {
  //   userReducers: {
  //     user: localStorage.getItem("user")
  //       ? JSON.parse(localStorage.getItem("user"))
  //       : null,
  //   },
  cart: {
    data: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [],
    ward: [],
    district: [],
    city: [],
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    paymentMethod: "PayPal",
    ispay: false,
  },
};

const reducer = combineReducers({
  bookReducers: bookReducers,
  book: bookReducer,
  bill: billReducer,
  userReducers: userReducers,
  homeReducers: homeReducers,
  productReducers: productReducers,
  profileReducers: profileReducers,
  cart: cartReducer,
  purchaseReducers: purchaseReducers,
  addressSave: addressSaveReducer,
  addressListMy: addressListMyReducer,
  addressDelete: addressDeleteReducer,
  // order: orderReducer,
  // orderListMy: orderListMyReducer,
  // orderListAll: orderListAllReducer,
  // orderPreview: orderPreviewReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderDeliver: orderDeliverReducer,
  orderSummary: orderSummaryReducer,
  orderPay: orderPayReducer,
  paymentMethodSave: paymentMethodSaveReducer,
  paymentMethodListMy: paymentMethodListMyReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);
export default store;
