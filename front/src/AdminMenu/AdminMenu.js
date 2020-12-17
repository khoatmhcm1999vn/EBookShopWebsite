import React, { useState, useEffect, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signOut, isAuthenticated } from "../auth";
import { itemTotal } from "../core/cartHelpers";
import { read } from "../user/apiUser";

const AdminMenu = ({ history }) => {
  const isActive = (history, path) => {
    if (history.location.pathname === path) {
      return { color: "#6d36c5ad" };
    } else {
      return { color: "#fff" };
    }
  };

  const { token } = isAuthenticated();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userx1, setUser] = useState("");

  const {
    user: { _id, name, role },
  } = isAuthenticated();

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
    if (isAuthenticated()) init(_id, token);
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
            style={isActive(history, "/about")}
            to="/about"
          >
            My Web <i className="fa fa-store"></i>
          </Link>
        </li> */}

        {/* Admin Links */}
        {isAuthenticated() && isAuthenticated().user.role.includes("admin") && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/about")}
                to="/about"
              >
                My Book Shop Web <i className="fa fa-store"></i>
              </Link>
            </li>

            {/* <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/adminx1/orders")}
                to="/adminx1/orders"
              >
                My Orders Tracker <i className="fa fa-store"></i>
              </Link>
            </li> */}

            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/dashboard")}
                to="/dashboard"
              >
                <i className="fa fa-home"></i>&nbsp;Home Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/admin/dashboard")}
                to="/admin/dashboard"
              >
                {showError()}
                <i className="far fa-user" /> Hello, {userx1.name} - Role:&nbsp;
                {Object.values(role) === "ROLE_ADMIN"
                  ? "Registered User"
                  : "Admin"}
                {showLoading()}
              </Link>
            </li>
          </>
        )}

        {isAuthenticated() && (
          <li className="nav-item">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#fff" }}
              onClick={() =>
                signOut(() => {
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

export default withRouter(AdminMenu);
