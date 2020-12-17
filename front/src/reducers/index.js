// import statReducer from "./stat.reducer";
// import categoryReducer from './category.reducer';
// import productReducer from "./product.reducer";

// export default combineReducers({
//   loginReducer,
//   registerReducer,
//   forgotpasswordReducer,
//   resetpasswordReducer,

//   branchReducer,
//   supplierReducer,
//   productReducer,

//   sematable,

//   statReducer,
// });

// import productReducer from "./product.reducer";
// import { combineReducers } from "redux";

import { combineReducers } from "redux";

import loginReducer from "./login.reducer";
import registerReducer from "./register.reducer";
import forgotpasswordReducer from "./forgotpassword.reducer";
import resetpasswordReducer from "./resetpassword.reducer";

import branchReducer from "./branch.reducer";
import supplierReducer from "./supplier.reducer";

import statReducer from "./stat.reducer";
import productReducer from "./product.reducer";
import categoryReducer from "./category.reducer";

import authReducer from "./auth.reducer";
import cartReducer from "./cart.reducer";
import userReducer from "./user.reducer";
import orderReducer from "./order.reducer";

import { reducer as sematable } from "sematable";

const rootReducer = combineReducers({
  product: productReducer,
  category: categoryReducer,
  order: orderReducer,

  auth: authReducer,
  cart: cartReducer,
  user: userReducer,

  login: loginReducer,
  regiser: registerReducer,
  forgotpasswordReducer: forgotpasswordReducer,
  resetpasswordReducer: resetpasswordReducer,
  branchReducer: branchReducer,
  supplierReducer: supplierReducer,
  statReducer: statReducer,
});

export default rootReducer;
