import React, { useEffect } from "react"; //  useEffect // useState, // Component,

//Components
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";

import UserDashboard from "./user/UserDashboard";
import About from "./About/About";
import BestSeller from "./core/BestSeller";
import Shop from "./core/Shop";

// import Search from "./core/Search";

import Product from "./core/Product";
import Cart from "./core/Cart";

import CartPage from "./Page/CartPage/CartPage";
import ProductDetailsPage from "./ProductDetailsPage/ProductDetails";

// PrivateRoutes folder
import PrivateRoute from "./auth/PrivateRoute";
import UserProfile from "./user/UserProfile";

// AdminDashboard folder
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./user/AdminDashboard";

import Register from "./components/register";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Profile from "./components/profile";

import Orders from "./admin/Orders";
// import OrdersChart from "./admin/OrdersChart";

import BranchCreate from "./components/branch/create";
import BranchUpdate from "./components/branch/update";
import BranchIndex from "./components/branch/index";

import SupplierCreate from "./components/supplier/create";
import SupplierUpdate from "./components/supplier/update";
import SupplierIndex from "./components/supplier/index";

// import UserCreate from "./components/user/create";
// import UserUpdate from "./components/user/update";
// import UserIndex from "./components/user/index";

import Passwordreset from "./components/passwordreset";
import Passwordforgot from "./components/passwordforgot";

import NotFound from "./NotFound";

import AdminProduct from "./admin/AdminProduct/AdminProduct";

import CheckoutPage from "./Page/CheckoutPage/CheckoutPage";
import OrderPage from "./Page/OrderPage/OrderPage";
import OrderDetailsPage from "./Page/OrderDetailsPage/OrderDetailsPage";

import AdminOrders from "./Page/AdminOrders/AdminOrders";

// import { getInitialData } from "./actions";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import * as loginActions from "./actions/login.action";
import { isUserLoggedIn, updateCart, getInitialData } from "./actions";
import { useDispatch, useSelector } from "react-redux";
// import { isUserLoggedIn, updateCart } from "./actions";

import { isAuthenticated } from "./auth/index";

import "./App.css";

// Protected Route

const App = (props) => {
  // const {pathname} = this.props.location;
  const dispatch = useDispatch();
  useSelector(({ loginReducer }) => loginReducer);

  const auth = useSelector((state) => state.auth);

  const token = isAuthenticated().token;

  // useEffect(() => {
  //   dispatch(getInitialData());
  // }, []);

  useEffect(() => {
    if (!auth.authenticate) {
      // dispatch(isUserLoggedIn());
      isAuthenticated();
    }
    if (isAuthenticated()) {
      dispatch(getInitialData(isAuthenticated().user._id, token));
      // auth.authenticate
    }
  }, []);

  useEffect(() => {
    console.log("App.js - updateCart");
    if (isAuthenticated())
      dispatch(updateCart(isAuthenticated().user._id, token));
  }, []);

  // const SecuredRoute = ({ component: Component, ...rest }) => (
  //   <Route
  //     {...rest}
  //     component={(props) => {
  //       const token = window.localStorage.getItem("token");
  //       if (token) {
  //         return <Component {...props} />;
  //       } else {
  //         return <Redirect to={`/`} />;
  //       }
  //     }}
  //   />
  // );
  // const {pathname} = this.props.location;

  const SecuredRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        // ternary condition
        loginActions.isLoggedIn() === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );

  //  <Route
  //   {...rest}
  //   render={(props) =>
  //     // ternary condition

  //     loginActions.isLoggedIn() === true ? (
  //       <Component {...props} />
  //     ) : (
  //       <Redirect to="/login" />
  //     )
  //   }
  // />

  // const AdminRoute = ({ component: Component, ...rest }) => (
  //   <Route
  //     {...rest}
  //     render={(props) =>
  //       // ternary condition

  //       isAuthenticated() &&
  //       isAuthenticated().user.roles.includes("admin") ? (
  //         <Component {...props} />
  //       ) : (
  //         <Redirect to="/login" />
  //       )
  //     }
  //   />
  // );

  return (
    <div className="App">
      <Router>
        <Switch>
          <AdminRoute path="/about" exact component={About} />
          <Route exact path="/" component={Home} />
          {/* {isAuthenticated().user.roles.includes("ROLE_ADMIN") && <Header />}
          {isAuthenticated().user.roles.includes("ROLE_ADMIN") && <Sidebar />} */}
          <Route exact path="/register" component={Register} />
          <Route exact path="/login/:notify?" component={Login} />
          <AdminRoute exact path="/dashboard" component={Dashboard} />
          <SecuredRoute exact path="/profile" component={Profile} />
          <AdminRoute exact path="/branch/" component={BranchIndex} />
          <AdminRoute exact path="/branch/create" component={BranchCreate} />
          <AdminRoute path="/adminx1/orders" component={AdminOrders} />
          <AdminRoute
            exact
            path="/branch/update/:id"
            component={BranchUpdate}
          />
          <AdminRoute exact path="/supplier/" component={SupplierIndex} />
          <AdminRoute
            exact
            path="/supplier/create"
            component={SupplierCreate}
          />
          <AdminRoute
            exact
            path="/supplier/update/:id"
            component={SupplierUpdate}
          />
          <Route path="/:productId/p" component={ProductDetailsPage} />
          {/* Admin Routes */}
          <AdminRoute
            path="/admin/dashboard"
            exact
            component={AdminDashboard}
          />
          <AdminRoute path="/admin/orders" exact component={Orders} />
          {/* User Routes */}
          <Route path="/best" exact component={BestSeller} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/signin" exact component={Signin} />{" "}
          <Route path="/shop" exact component={Shop} />
          {/* <Route exact path="/search" component={Search} /> */}
          <Route path="/product/:productId" exact component={Product} />
          {/* <Route path="/cart" exact component={Cart} /> */}
          <Route path="/cart" component={CartPage} />
          <PrivateRoute path="/checkout" component={CheckoutPage} />
          <PrivateRoute path="/account/orders" component={OrderPage} />
          <PrivateRoute
            path="/order_details/:orderId"
            component={OrderDetailsPage}
          />
          {/* <Route path="/cartx1" component={CartPage} /> */}
          {/* <Route path="/products" component={AdminProduct} /> */}
          {/* User Routes */}
          <Route
            exact
            path="/password/reset/:token"
            component={Passwordreset}
          />
          <Route exact path="/password/forgot" component={Passwordforgot} />
          <PrivateRoute
            path="/user/dashboard"
            exact
            component={UserDashboard}
          />
          <SecuredRoute
            path="/profilex/:userId"
            exact
            component={UserProfile}
          />
          <div className="container-fluid">
            <Route exact component={NotFound} />
          </div>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
