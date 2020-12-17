import React, { useState, useEffect, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signOut, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";

import { read } from "../user/apiUser";

import { useDispatch, useSelector } from "react-redux";
import { signout } from "../actions";

const Menu = ({ history }) => {
  const isActive = (history, path) => {
    if (history.location.pathname === path) {
      return { color: "#ff9900" };
    } else {
      return { color: "#fff" };
    }
  };

  const { _id, user, roles, token } = isAuthenticated();

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userx1, setUser] = useState("");

  const cart = useSelector((state) => state.cart);

  const getEnumRoles = (roles) => {
    const role = roles;
  };

  const logout = () => {
    dispatch(signout());
  };

  const init = (userId, token) => {
    read(userId, token)
      .then((data) => {
        if (!data) {
          // console.log(data.error);
          setError("fail");
        } else {
          setLoading(false);
          setUser(data);
        }
      })
      .catch(catchError);
  };

  useEffect(() => {
    if (isAuthenticated()) init(isAuthenticated().user._id, token);
    // init(isAuthenticated().user._id, token);
  }, []);

  const catchError = (error) => {
    setError({ error: error });
  };

  const showError = () => error && <h2>Fail to load!</h2>;

  const showLoading = () =>
    loading && (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <div>
      <ul className="nav nav-tabs bg-primary">
        {/* <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, "/feed")}
            to="/feed"
          >
            My Feed <i className="fa fa-store"></i>
          </Link>
        </li> */}

        <li className="nav-item">
          <Link className="nav-link" style={isActive(history, "/")} to="/">
            <i className="fa fa-home"></i>&nbsp;Home
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, "/best")}
            to="/best"
          >
            <i className="fa fa-home"></i>&nbsp;Best Seller
          </Link>
        </li>

        {/* <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, "/products")}
            to="/products"
          >
            Shop Products
          </Link>
        </li> */}

        {/* User Links  */}
        {isAuthenticated() && isAuthenticated().user.role.includes("user") && (
          <Fragment>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/shop")}
                to="/shop"
              >
                Shop
              </Link>
            </li>

            {/* <li className="nav-item">
                <Link
                  to="/search"
                  className="nav-link"
                  style={isActive(history, "/search")}
                >
                  Search
                </Link>
              </li> */}

            <li className="nav-item">
              <a
                className="nav-link"
                style={isActive(history, "/cart")}
                href="/cart"
              >
                <i className="fa fa-shopping-cart"></i>&nbsp;
                <sup>
                  {/* <small className="cart-badge">{itemTotal()}</small> */}
                  <small className="cart-badge">
                    {Object.keys(cart.cartItems).length}
                  </small>
                </sup>
              </a>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/account/orders")}
                to="/account/orders"
              >
                Orders
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/user/dashboard")}
                to="/user/dashboard"
              >
                {showError()}
                <i className="far fa-user" /> Hello, {userx1.name} - Role:&nbsp;
                {/* {JSON.stringify(userx1)} */}
                {Object.values(user.role) !== "admin"
                  ? "Registered User"
                  : "Admin"}
                {showLoading()}
              </Link>
            </li>
          </Fragment>
        )}

        {/* Admin Links */}
        {isAuthenticated() && isAuthenticated().user.role.includes("admin") && (
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/dashboard")}
              to="/dashboard"
            >
              Admin Dashboard
            </Link>
          </li>
        )}

        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/shop")}
                to="/shop"
              >
                Shop
              </Link>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={isActive(history, "/cart")}
                href="/cart"
              >
                <i className="fa fa-shopping-cart"></i>&nbsp;
                <small className="cart-badge">
                  {Object.keys(cart.cartItems).length}
                </small>
              </a>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/login")}
                to="/login"
              >
                Sign In
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/register")}
                to="/register"
              >
                Sign Up
              </Link>
            </li>

            {/* <li className="nav-item">
              <Link
                to="/search"
                className="nav-link"
                style={isActive(history, "/search")}
              >
                Search
              </Link>
            </li> */}

            {/* <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signupx")}
                to="/a"
              >
                Ab Step
              </Link>
            </li> */}

            {/* <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signupx")}
                to="/b"
              >
                Show Image Upload S3
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signupx")}
                to="/api/document/upload"
              >
                NewFileUpload
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signupx")}
                to="/ca"
              >
                FileUpload
              </Link>
            </li> */}
          </Fragment>
        )}

        {isAuthenticated() && (
          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#fff" }}
              onClick={() =>
                logout(() => {
                  history.push("/");
                })
              }
            >
              <i className="fa fa-sign-out-alt">Sign Out</i>
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
