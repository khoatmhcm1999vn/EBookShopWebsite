// import React, { Component, useState, useEffect } from "react";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

// //Components
// import Home from "./core/Home";
// import Signup from "./user/Signup";
// import Signin from "./user/Signin";
// //import Navbar from "./Navbar/Navbar";
// import UserDashboard from "./user/UserDashboard";
// import About from "./About/About";
// import Shop from "./core/Shop";
// import Search from "./core/Search";
// import Product from "./core/Product";
// import Cart from "./core/Cart";

// //PrivateRoutes folder
// import PrivateRoute from "./auth/PrivateRoute";
// import UserProfile from "./user/UserProfile";

// //AdminDashboard folder
// import AdminRoute from "./auth/AdminRoute";
// import AdminDashboard from "./user/AdminDashboard";
// import AddCategory from "./admin/AddCategory";
// import ManageCategories from "./admin/ManageCategories";
// import UpdateCategory from "./admin/UpdateCategory";
// import Orders from "./admin/Orders";
// import OrdersChart from "./admin/OrdersChart";
// import AddProduct from "./admin/AddProduct";
// import ManageProducts from "./admin/ManageProducts";
// import UpdateProduct from "./admin/UpdateProduct";
// import ForgotPage from "./ForgotPage/ForgotPage";
// import ResetPage from "./ResetPage/ResetPage";

// import BestSeller from "./core/BestSeller";

// import Stepper from "./Stepper";

// import ShowImageUploadS3 from "./ShowImageUploadS3/ShowImageUploadS3";

// // import "bootstrap/dist/css/bootstrap.min.css";
// // import "./Route.css";
// import App from "./App";

// import NewFileUpload from "./FileUpload/NewFileUpload";
// import FileDescriptionEdit from "./FileUpload/FileDescriptionEdit";

// // import * as serviceWorker from "./registerServiceWorker";
// // import history from "./history";

// import AuthService from "./services/auth";

// import FileUpload from "./FileUpload/FileUpload";

// import Feed from "./FormElements/Feed";

// import classes from "./Routes.css";

// class Routes extends Component {
//   render() {
//     return (
//       <div className={classes.Routes}>
//         <FileUpload />
//       </div>
//     );
//   }
// }

// export default Routes;

// import Login from "./Login/Login";
// import Register from "./Register/Register";
// import HomeLogin from "./HomeLogin/HomeLogin";
// import Profile from "./Profile/Profile";
// import BoardUser from "./BoardUser/BoardUser";
// import BoardModerator from "./BoardModerator/BoardModerator";
// import BoardAdmin from "./BoardAdmin/BoardAdmin";

// const Routes = () => {
//   // const [showModeratorBoard, setShowModeratorBoard] = useState(false);
//   // const [showAdminBoard, setShowAdminBoard] = useState(false);
//   // const [currentUser, setCurrentUser] = useState(undefined);

//   // useEffect(() => {
//   //   const user = AuthService.getCurrentUser();

//   //   if (user) {
//   //     setCurrentUser(user);
//   //     setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
//   //     setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
//   //   }
//   // }, []);

//   // const logOut = () => {
//   //   AuthService.logout();
//   // };

//   return (
//     <Router>
//       <Switch>
//         {/* User Routes */}
//         <Route path="/" exact component={Home} />

//         <Route path="/feed" exact component={Feed} />

//         <Route path="/best" exact component={BestSeller} />

//         <Route path="/about" exact component={About} />

//         <Route path="/a" exact component={Stepper} />
//         <Route path="/b" exact component={ShowImageUploadS3} />

//         <Route path="/signup" exact component={Signup} />
//         <Route path="/signin" exact component={Signin} />
//         <Route path="/shop" exact component={Shop} />

//         <Route exact path="/search" component={Search} />
//         <Route path="/product/:productId" exact component={Product} />
//         <Route path="/cart" exact component={Cart} />
//         <Route exact path="/auth/password/forgot" component={ForgotPage} />
//         <Route exact path="/auth/password/reset/:token" component={ResetPage} />

//         {/* User Routes */}
//         <PrivateRoute path="/user/dashboard" exact component={UserDashboard} />
//         <PrivateRoute path="/profile/:userId" exact component={UserProfile} />

//         {/* Admin Routes */}
//         <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
//         <AdminRoute path="/create/category" exact component={AddCategory} />
//         <AdminRoute
//           exact
//           path="/admin/categories"
//           component={ManageCategories}
//         />
//         <AdminRoute
//           exact
//           path="/admin/category/update/:categoryId"
//           component={UpdateCategory}
//         />
//         <AdminRoute path="/create/product" exact component={AddProduct} />
//         <AdminRoute path="/admin/products" exact component={ManageProducts} />
//         <AdminRoute
//           path="/admin/product/update/:productId"
//           exact
//           component={UpdateProduct}
//         />
//         <AdminRoute path="/admin/orders" exact component={Orders} />
//         <AdminRoute path="/admin/orderschart" exact component={OrdersChart} />

//         <div className="bg-success">
//           <Route exact path={"/"} component={App} />

//           <Route exact path={"/ca"} component={App} />
//           <Route path={"/api/document/upload"} component={NewFileUpload} />
//           <Route
//             exact
//             path={"/api/document/:id"}
//             component={FileDescriptionEdit}
//           />
//         </div>
//       </Switch>
//     </Router>
//   );
// };
