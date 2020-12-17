import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import axios from "axios";

import swal from "sweetalert";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as loginActions from "../../actions/login.action";
import { server } from "../../constants";

import { isAuthenticated } from "../../auth";

import { Redirect } from "react-router-dom";

// import { login } from "../../actions";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .min(2, "username is Too Short!")
    .max(50, "username is Too Long!")
    .required("Username is Required"),

  password: Yup.string().required("Password is required"),
});

const Login = (props) => {
  const dispatch = useDispatch();
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (
      localStorage.getItem(server.TOKEN_KEY) != null &&
      isAuthenticated().user.role.includes("user")
    ) {
      props.history.push("/");
    } else if (
      localStorage.getItem(server.TOKEN_KEY) != null &&
      isAuthenticated().user.role.includes("admin")
    ) {
      return props.history.push("/dashboard");
    }
    let notify = props.match.params["notify"];
    if (notify !== undefined) {
      if (notify === "error") {
        swal("Activation Fail please try again !", "", "error");
      } else if (notify === "success") {
        swal("Activation Success your can login !", "", "success");
      }
    }
  }, [server.TOKEN_KEY]);

  const showForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  }) => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group input-group has-feedback">
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={values.email}
            className="form-control"
            placeholder="Email"
            className={
              errors.email && touched.email
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-user"></span>
            </div>
          </div>
          {errors.email && touched.email ? (
            <small id="passwordHelp" class="text-danger">
              {errors.email}
            </small>
          ) : null}
        </div>

        <div className="form-group input-group mb-3 has-feedback">
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            className="form-control"
            placeholder="Password"
            className={
              errors.password && touched.password
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-lock"></span>
            </div>
          </div>
          {errors.password && touched.password ? (
            <small id="passwordHelp" class="text-danger">
              {errors.password}
            </small>
          ) : null}
        </div>

        <div class="row">
          <div class="col-8">
            <div class="icheck-primary">
              <input type="checkbox" id="remember" />
              <label for="remember">Remember Me</label>
            </div>
          </div>
          <div class="col-4">
            <button
              type="submit"
              disabled={isSubmitting}
              class="btn btn-primary btn-block"
            >
              Sign In
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div class="login-page">
      <div className="register-box">
        <div className="register-logo">
          <a href="../../index2.html">
            <b>Book Shop</b> Web
          </a>
        </div>
        <div className="card">
          <div className="card-body register-card-body">
            <p className="login-box-msg">Sign in to start your session</p>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={(values, { setSubmitting }) => {
                dispatch(loginActions.signin(values, props.history));
                // dispatch(login(values, props.history));
                setSubmitting(false);
              }}
              validationSchema={LoginSchema}
            >
              {/* {this.showForm()}            */}
              {(props) => showForm(props)}
            </Formik>
            <p class="mb-1">
              <Link to="/password/forgot">I forgot my password</Link>
            </p>
            <p class="mb-0">
              <Link to="/register">Register a new membership</Link>
            </p>
            <p className="mb-1">
              {isAuthenticated() &&
              isAuthenticated().user.role.includes("ROLE_ADMIN") ? (
                <Link to="/dashboard">Go Dashboard</Link>
              ) : (
                <Link to="/">Go Home</Link>
              )}
            </p>
          </div>
          {/* /.form-box */}
        </div>
        {/* /.card */}
      </div>
    </div>
  );
};

export default Login;
