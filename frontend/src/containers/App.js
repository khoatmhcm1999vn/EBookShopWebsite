import React, { useEffect, useRef } from "react";
import {
  // BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../actions/user.action";

import AdminHomeContainer from "./adminhome.container";
import SupportScreen from "../screens/SupportScreen";
import HomeContainer from "./home.container";
import BookContainer from "./book.container";
import BookScreen from "../screens/BookScreen/BookScreen";
import CategoryContainer from "./category.container";
import AuthorContainer from "./author.container";
import PublisherContainer from "./publisher.container";
import UserContainer from "./user.container";
import LoginRegisterContainer from "./login.register.container";
import StatisticalContainer from "./statistical.container";
import BillContainer from "./bill.container";
import BillScreen from "../screens/BillScreen/BillScreen";

import VerifyRegisterAccountContainer from "./verify.register.account.container";
import ForgotPasswordContainer from "./forgot.password.container";
import ProfileContainer from "./profile.container";
import HistoryPurchase from "./history.purchase.container";
import ProductDetailContainer from "./product.detail.container";
import CartContainer from "./cart.container";
import ShippingScreen from "../screens/ShippingScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PlaceOrderScreen from "../screens/PlaceOrderScreen";
import VerifyPaymentContainer from "./verify.payment.container";
import OrderScreen from "../screens/OrderScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import BookTable from "../screens/BookScreen/BookTable";

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const isMounted = useRef(false);
  if (!isMounted.current) {
    // getLocalStorage('token') &&
    dispatch(loadUser(history));
  }
  useEffect(() => {
    isMounted.current = true;
  }, []);
  // const islogin = useSelector((state) => state.userReducers.user.islogin);
  const currentUser = useSelector(
    (state) => state.userReducers.user.currentUser
  );
  // if (currentUser) console.log(currentUser.user.is_admin);
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        currentUser && !currentUser.user.is_admin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login_register",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
  const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        currentUser && currentUser.user.is_admin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login_register",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
  return (
    <>
      <ToastContainer autoClose={2000} />
      <Switch location={location}>
        {/* <Route
          exact
          path="/"
          render={() => {
            return <Redirect to="/dashboard" />;
          }}
        /> */}
        <Route exact path="/" component={HomeContainer} />
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
        <Route exact path="/forgotpass/" component={ForgotPasswordContainer} />
        {/* USER */}
        <Route exact path="/profile/:email" component={ProfileContainer} />
        <PrivateRoute
          exact
          path="/purchase_history"
          component={HistoryPurchase}
        />
        <Route
          render={(props) => <ProductDetailContainer {...props} />}
          exact
          path="/product/:id"
        />
        <Route exact path="/cart" component={CartContainer} />
        <PrivateRoute
          path="/shipping"
          component={ShippingScreen}
        ></PrivateRoute>
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
        <Route
          exact
          path="/paymentg/:token"
          component={VerifyPaymentContainer}
        />
      </Switch>
    </>
  );
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
