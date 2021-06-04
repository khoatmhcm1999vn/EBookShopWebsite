import React, { useState, useEffect, useRef } from "react"
import {
  // BrowserRouter as Router,
  // Switch,
  Route,
  Redirect
  // useLocation,
  // useHistory,
} from "react-router-dom"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { useDispatch, useSelector } from "react-redux"
import { getListProductCategoryIds } from "./actions/home.action"
import { loadUser, logout } from "./actions/user.action"

import AdminHomeContainer from "./containers/adminhome.container"
import SupportScreen from "./screens/SupportScreen"
import HomeContainer from "./containers/home.container"
import BookContainer from "./containers/book.container"
import BookScreen from "./screens/BookScreen/BookScreen"
import CategoryContainer from "./containers/category.container"
import AuthorContainer from "./containers/author.container"
import PublisherContainer from "./containers/publisher.container"
import UserContainer from "./containers/user.container"
import LoginRegisterContainer from "./containers/login.register.container"
import StatisticalContainer from "./containers/statistical.container"
import BillContainer from "./containers/bill.container"
import BillScreen from "./screens/BillScreen/BillScreen"

import ResendTokenContainer from "./containers/resend.token.container"
import VerifyRegisterAccountContainer from "./containers/verify.register.account.container"
import ForgotPasswordContainer from "./containers/forgot.password.container"
import ProfileContainer from "./containers/profile.container"
import HistoryPurchase from "./containers/history.purchase.container"
import ProductDetailContainer from "./containers/product.detail.container"
import CartContainer from "./containers/cart.container"
import ShippingScreen from "./screens/ShippingScreen"
import PaymentScreen from "./screens/PaymentScreen"
import PlaceOrderScreen from "./screens/PlaceOrderScreen"
import VerifyPaymentContainer from "./containers/verify.payment.container"
import OrderScreen from "./screens/OrderScreen"
import FavoriteScreen from "./screens/FavoriteScreen"
import BookTable from "./screens/BookScreen/BookTable"

// import LandingScreen from "../screens/LandingScreen";
import ContactScreen from "./screens/ContactScreen/ContactScreen"
import HomeScreen from "./screens/HomeScreen/HomeScreen"
import ShopScreen from "./screens/ShopScreen/ShopScreen"
// import SearchScreen from "../screens/SearchScreen";
import RankingScreen from "./screens/RankingScreen/RankingScreen"
import "./i18n"
import AdminDashboardScreen from "./screens/AdminDashboardScreen"
// import SearchBox from "./components/SearchBox/SearchBox";

export default function App() {
  const dispatch = useDispatch()
  // const location = useLocation();
  // const history = useHistory();

  const isMounted = useRef(false)
  if (!isMounted.current) {
    // getLocalStorage('token') &&
    dispatch(loadUser())
  }

  useEffect(() => {
    isMounted.current = true
    dispatch(getListProductCategoryIds())
  }, [dispatch])

  // const islogin = useSelector((state) => state.userReducers.user.islogin);
  const currentUser = useSelector(state => state.userReducers.user.currentUser)
  // console.log(currentUser);

  // const setAutoLogout = (milliseconds) => {
  //   setTimeout(() => {
  //     dispatch(logout());
  //   }, milliseconds);
  // };
  if (currentUser) {
    // setAutoLogout(60 * 60 * 10000);
  }

  // if (currentUser) console.log(currentUser.user.is_admin);
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        currentUser && !currentUser.user.is_admin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login_register",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
  const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        currentUser && currentUser.user.is_admin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login_register",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )

  return (
    <>
      {/* <div>
        <Route
          render={({ history }) => <SearchBox history={history}></SearchBox>}
        ></Route>
      </div>
      <Route
          exact
          path="/"
          render={() => {
            return <Redirect to="/dashboard" />;
          }}
        /> */}
      <ToastContainer autoClose={1000} />
      <Route exact path="/" component={HomeScreen} />
      {/* ADMIN */}
      <Route exact path="/dashboard" component={AdminHomeContainer} />
      <AdminRoute path="/support" component={SupportScreen}></AdminRoute>
      <Route exact path="/bookmanager" component={BookContainer} />
      <Route exact path="/book" component={BookScreen} />
      <Route exact path="/bill" component={BillScreen} />
      <Route path="/test" component={BookTable} />
      <Route exact path="/categorymanager" component={CategoryContainer} />
      <Route exact path="/authormanager" component={AuthorContainer} />
      <Route exact path="/publishermanager" component={PublisherContainer} />
      <Route exact path="/usermanager" component={UserContainer} />
      <Route exact path="/statistical" component={StatisticalContainer} />
      <Route exact path="/billmanager" component={BillContainer} />
      <Route exact path="/login_register" component={LoginRegisterContainer} />
      <Route
        exact
        path="/confirm/:token"
        component={VerifyRegisterAccountContainer}
      />
      <Route exact path="/resend-token" component={ResendTokenContainer} />
      <Route exact path="/forgotpass/" component={ForgotPasswordContainer} />
      {/* USER */}
      <Route exact path="/profile/:email" component={ProfileContainer} />
      <PrivateRoute
        exact
        path="/purchase_history"
        component={HistoryPurchase}
      />
      <Route
        render={props => <ProductDetailContainer {...props} />}
        exact
        path="/product/:id"
      />
      <Route exact path="/cart" component={CartContainer} />
      <PrivateRoute path="/shipping" component={ShippingScreen}></PrivateRoute>
      <PrivateRoute path="/payment" component={PaymentScreen}></PrivateRoute>
      <PrivateRoute
        path="/placeorder"
        component={PlaceOrderScreen}
      ></PrivateRoute>
      <PrivateRoute path="/order/:id" component={OrderScreen}></PrivateRoute>
      <PrivateRoute
        exact
        path="/wishlist"
        component={FavoriteScreen}
      ></PrivateRoute>
      <Route exact path="/paymentg/:token" component={VerifyPaymentContainer} />

      <Route exact path="/contacts" component={ContactScreen} />
      <Route exact path="/shop" component={HomeContainer} />

      <Route path="/shop-page/name/:name?" component={ShopScreen} exact></Route>
      <Route
        path="/shop-page/id_category/:id_category"
        component={ShopScreen}
        exact
      ></Route>
      <Route
        exact
        path="/shop-page/id_category/:id_category/sales/:sales/updatedAtByDay/:updatedAtByDay"
        component={ShopScreen}
      />
      <Route
        exact
        path="/shop-page/sales/:sales/updatedAtByDay/:updatedAtByDay"
        component={ShopScreen}
      />
      <Route
        exact
        path="/shop-page/id_category/:id_category/name/:name/min/:min/max/:max/stars/:stars/sales/:sales/updatedAtByDay/:updatedAtByDay/order/:order/pageNumber/:pageNumber/pageSize/:pageSize"
        component={ShopScreen}
      />
      <Route exact path="/shop-page" component={ShopScreen} />
      <Route exact path="/testadmin" component={AdminDashboardScreen} />

      <Route exact path="/ranking-page" component={RankingScreen} />
      <Route
        exact
        path="/ranking-page/id_category/:id_category"
        component={RankingScreen}
      />
    </>
  )
}

// class App extends Component {
//   render() {
//     return (
//       <Router>
//         <Switch>
//           <Route exact path="/" component={HomeContainer} />
//           <Route exact path="/bookmanager" component={BookContainer} />
//           <Route exact path="/categorymanager" component={CategoryContainer} />
//           <Route exact path="/authormanager" component={AuthorContainer} />
//           <Route
//             exact
//             path="/publishermanager"
//             component={PublisherContainer}
//           />
//           <Route exact path="/usermanager" component={UserContainer} />
//           <Route exact path="/login" component={LoginContainer} />
//           <Route exact path="/statistical" component={StatisticalContainer} />
//           <Route exact path="/billmanager" component={BillContainer} />
//         </Switch>
//       </Router>
//     );
//   }
// }
