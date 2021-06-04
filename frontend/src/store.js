import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"

import bookReducers from "./reducers/book.reducer"
import userReducers from "./reducers/user.reducer"
import homeReducers from "./reducers/home.reducer"
import productReducers from "./reducers/product.reducer"
import profileReducers from "./reducers/profile.reducer"
import { cartReducer } from "./reducers/cart.reducer"
import purchaseReducers from "./reducers/purchase.reducer"
import {
  addressSaveReducer,
  addressListMyReducer,
  addressDeleteReducer
} from "./reducers/address.reducer"
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderDeliverReducer,
  orderPayReducer,
  orderSummaryReducer
} from "./reducers/orderReducers"
import {
  paymentMethodListMyReducer,
  paymentMethodSaveReducer
} from "./reducers/paymentReducers"

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
    ispay: false
  }
}
const reducer = combineReducers({
  bookReducers,
  userReducers,
  homeReducers,
  productReducers,
  profileReducers,
  cart: cartReducer,
  purchaseReducers,
  addressSave: addressSaveReducer,
  addressListMy: addressListMyReducer,
  addressDelete: addressDeleteReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderDeliver: orderDeliverReducer,
  orderSummary: orderSummaryReducer,
  orderPay: orderPayReducer,
  paymentMethodSave: paymentMethodSaveReducer,
  paymentMethodListMy: paymentMethodListMyReducer
})
const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    console.log("Logout Root Reducer")
    state = undefined
  }
  return reducer(state, action)
}
const middleware = [thunk]
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)
export default store

// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(
//   rootReducer,
//   initialState,
//   composeEnhancer(applyMiddleware(...middleware))
// );
