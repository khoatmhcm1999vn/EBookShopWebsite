import React, { useState, useEffect, useRef, createContext } from "react"
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
import { loadUser, logout, setLoginSuccess } from "./actions/user.action"

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

import { useCookies } from "react-cookie"
import { getJwtToken, getRefreshToken } from "./utils/cookie"
import { getCurrentUser } from "./utils/jwtToken"

export const AuthUser = createContext()

export default function App() {
  const dispatch = useDispatch()
  // const location = useLocation();
  // const history = useHistory();

  // const isMounted = useRef(false)
  // if (!isMounted.current) {
  //    getLocalStorage('token') &&
  //   dispatch(loadUser())
  // }

  const [auth, setAuth] = useState({
    isLogin: false,
    isAdmin: true
  })
  const [isExpiredToken, setIsExpiredToken] = useState(false)
  const [cookies, setCookie] = useCookies(["access_token", "refresh-token"])

  const readCookie = () => {
    const token = getJwtToken()
    const refreshToken = getRefreshToken()

    if (token && refreshToken) {
      const user = getCurrentUser()
      dispatch(setLoginSuccess(user))
      if (user.role.includes("admin")) {
        return {
          isLogin: true,
          isAdmin: true,
          isSuperAdmin: false
        }
      } else {
        return {
          isLogin: true,
          isAdmin: false
        }
      }
    } else {
      return {
        isLogin: false,
        isAdmin: false
      }
    }
  }

  useEffect(() => {
    setAuth(readCookie())
  }, [])

  useEffect(() => {
    if (auth && Object.keys(cookies).length === 0) {
      setIsExpiredToken(true)
    }
  }, [cookies])

  console.log(auth)

  // useEffect(() => {
  //   //isMounted.current = true
  //   //console.log("test")
  //   if (getUser()) {
  //     dispatch(setLoginSuccess(getUser()))
  //   }
  //   //dispatch(getListProductCategoryIds())
  // }, [dispatch])

  const { user } = useSelector(state => state.userReducers)
  console.log(user)
  // const categories = useSelector(
  //   state => state.homeReducers.book.dataProductCategoryIds
  // )

  // const setAutoLogout = (milliseconds) => {
  //   setTimeout(() => {
  //     dispatch(logout());
  //   }, milliseconds);
  // };
  // if (currentUser) {
  //   // setAutoLogout(60 * 60 * 10000);
  // }

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        auth.isLogin && !auth.isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
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
        auth.isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
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
      <AuthUser.Provider value={{ auth, setAuth }}>
        <Route exact path="/" component={HomeScreen} />
        {/* ADMIN */}
        <AdminRoute exact path="/dashboard" component={AdminHomeContainer} />
        <AdminRoute path="/support" component={SupportScreen} />
        <AdminRoute exact path="/bookmanager" component={BookContainer} />
        <AdminRoute exact path="/book" component={BookScreen} />
        <AdminRoute exact path="/bill" component={BillScreen} />
        {/* <Route path="/test" component={BookTable} /> */}
        <AdminRoute
          exact
          path="/categorymanager"
          component={CategoryContainer}
        />
        <AdminRoute exact path="/authormanager" component={AuthorContainer} />
        <AdminRoute
          exact
          path="/publishermanager"
          component={PublisherContainer}
        />
        <AdminRoute exact path="/usermanager" component={UserContainer} />
        <AdminRoute
          exact
          path="/statistical"
          component={StatisticalContainer}
        />
        <AdminRoute exact path="/billmanager" component={BillContainer} />
        <Route
          exact
          path="/login_register"
          component={LoginRegisterContainer}
        />
        <Route
          exact
          path="/confirm/:token"
          component={VerifyRegisterAccountContainer}
        />
        <Route exact path="/resend-token" component={ResendTokenContainer} />
        <Route exact path="/forgotpass/" component={ForgotPasswordContainer} />
        {/* USER */}
        <PrivateRoute
          exact
          path="/profile/:email"
          component={ProfileContainer}
        />
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
        <PrivateRoute path="/shipping" component={ShippingScreen} />
        <PrivateRoute path="/payment" component={PaymentScreen} />
        <PrivateRoute path="/placeorder" component={PlaceOrderScreen} />
        <PrivateRoute path="/order/:id" component={OrderScreen} />
        <PrivateRoute exact path="/wishlist" component={FavoriteScreen} />
        <Route
          exact
          path="/paymentg/:token"
          component={VerifyPaymentContainer}
        />
        <Route exact path="/contacts" component={ContactScreen} />
        <Route exact path="/shop" component={HomeContainer} />
        <Route exact path="/shop-page/name/:name?" component={ShopScreen} />
        <Route
          exact
          path="/shop-page/id_category/:id_category"
          component={ShopScreen}
        />
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
        {/* <Route exact path="/testadmin" component={AdminDashboardScreen} /> */}
        <Route exact path="/ranking-page" component={RankingScreen} />
        <Route
          exact
          path="/ranking-page/id_category/:id_category"
          component={RankingScreen}
        />
        {/* <Route path="*">
          <Redirect push to="/" replace />
        </Route> */}
      </AuthUser.Provider>
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
