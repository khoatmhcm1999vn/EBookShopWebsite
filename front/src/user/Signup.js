import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";

import RadioBox from "../core/RadioBox";

import { signUp } from "../auth";
import { fixRoles } from "../core/fixedRoles";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    success: false,
  });

  const { name, email, password, confirmPassword, success, error } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const handleFilters = () => {};

  const clickSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setValues({ ...values, error: "Password do not match" });
    } else {
      setValues({ ...values, error: false });
      signUp({ name, email, password }).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            error: "",
            success: true,
          });
        }
      });
    }
  };

  const signUpForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Confirm Password</label>
        <input
          onChange={handleChange("confirmPassword")}
          type="password"
          className="form-control"
          value={confirmPassword}
        />
      </div>

      {/* <div className="container-fluid ml-0 row  mark d-flex justify-content-center align-content-center">
        <RadioBox
          prices={fixRoles}
          handleFilters={(filters) => handleFilters(filters, "price")}
        />
      </div> */}

      <button onClick={clickSubmit} className="btn btn-primary float-right">
        Submit
      </button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => {
    return (
      <div
        className="alert alert-info"
        style={{ display: success ? "" : "none" }}
      >
        New account is created. Please <Link to="/signin">Sign In</Link>
      </div>
    );
  };

  return (
    <Layout
      title="Sign Up"
      description="Sign Up to Node React"
      className="container col-md-8 offset-md-2"
    >
      <div className="container w-50">
        <h1 className="title">Register</h1>
        {showSuccess()}
        {showError()}
        {signUpForm()}
        {JSON.stringify(values)}
      </div>
    </Layout>
  );
};

export default Signup;
