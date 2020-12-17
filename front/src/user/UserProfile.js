import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { read, update, updateUser } from "./apiUser";

import Footer from "../Footer/Footer";

const UserProfile = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    hashed_password: "",
    // error: "",
    success: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = isAuthenticated();

  const {
    user: { role },
  } = isAuthenticated();

  const { name, email, hashed_password, success } = values;

  const init = (userId) => {
    // console.log(userId);
    read(userId, token)
      .then((data) => {
        if (!data) {
          setError("fail");
          setLoading(true);
          // setValues({ ...values, error: data.err });
          // throw new Error("Failed to fetch posts.");
        } else {
          setLoading(false);
          setError("");
          setValues({ ...values, name: data.name, email: data.email });
        }
      })
      .catch(catchError());
  };

  useEffect(() => {
    init(match.params.userId);
  }, []);

  const handleChange = (name) => (e) => {
    // console.log(event.target.value);
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const catchError = (error) => {
    setError({ error: error });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    update(match.params.userId, token, { name, email, hashed_password })
      .then((data) => {
        if (!data) {
          // console.log(data.error);
          setError("fail");
          setLoading(true);
          // setValues({ ...values, error: data.error });
        } else {
          updateUser(data, () => {
            setError("");
            setLoading(false);
            setValues({
              ...values,
              name: data.name,
              email: data.email,
              success: true,
            });
          });
        }
      })
      .catch(catchError());
  };

  const redirectUser = (success) => {
    if (success) {
      if (isAuthenticated() && isAuthenticated().user.role.includes("admin")) {
        return <Redirect to="/dashboard" />;
      } else if (
        isAuthenticated() &&
        isAuthenticated().user.role.includes("user")
      )
        return <Redirect to="/user/dashboard" />;
      else return <Redirect to="/" />;
    }
  };

  // const redirectUser = (success) => (
  //   // if (success) {
  //   //   return <Redirect to="/cart" />;
  //   // }
  //   <div
  //     className="alert alert-info"
  //     style={{ display: success ? "" : "none" }}
  //   >
  //     Your profile has been updated successfully!
  //   </div>
  // );

  // const showError = (error) => (
  //   <div
  //     className="alert alert-danger"
  //     style={{ display: error ? "" : "none" }}
  //   >
  //     Fail to update your profile
  //   </div>
  // );

  const showError = () => error && <h2>Fail to load!</h2>;

  const showLoading = () =>
    loading && (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  const profileUpdate = (name, email, hashed_password) => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            onChange={handleChange("name")}
            className="form-control"
            value={name}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            type="email"
            onChange={handleChange("email")}
            className="form-control"
            value={email}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            type="password"
            onChange={handleChange("hashed_password")}
            className="form-control"
            value={hashed_password}
          />
        </div>

        <div>
          {/* User Links */}
          {isAuthenticated() && role.includes("admin") && (
            <Link
              className="btn btn-outline-warning float-left"
              // style={isActive(history, "/user/dashboard")}
              to="/admin/dashboard"
            >
              Back
            </Link>
          )}

          {/* User Links */}
          {isAuthenticated() && role.includes("user") && (
            <Link
              className="btn btn-outline-warning float-left"
              // className="nav-link"
              // style={isActive(history, "/user/dashboard")}
              to="/user/dashboard"
            >
              Back
            </Link>
          )}

          {/* <Link
            to="/user/dashboard"
            className="btn btn-outline-warning float-left"
          >
            Back
          </Link> */}

          <button onClick={clickSubmit} className="btn btn-primary float-right">
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout
      title="Profile"
      description="Update your profile"
      className="container-fluid"
    >
      <div className="container w-50">
        <h1 className="title m-3 text-center">Profile update</h1>
        {showLoading()}
        {profileUpdate(name, email, hashed_password)}
        {redirectUser(success)}
        {showError()}
      </div>
      {/* <Footer className="container-fluid" /> */}
    </Layout>
  );
};

export default UserProfile;
