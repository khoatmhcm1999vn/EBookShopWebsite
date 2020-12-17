import React, { useState, useEffect } from "react";
import AdminLayout from "../user/AdminLayout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

import Footer from "../Footer/Footer";

import { read } from "./apiUser";

const AdminDashboard = () => {
  const {
    user: { name, email, role, _id },
  } = isAuthenticated();

  const token = isAuthenticated().token;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");

  const init = (userId, token) => {
    read(_id, token)
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
    init(_id, token);
  }, []);

  const adminLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">Admin Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to={`/profile`}>
              Update Profile
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to={`/profilex/${_id}`}>
              Change Password
            </Link>
          </li>
          {/* <li className="list-group-item">
            <Link className="nav-link" to="/create/category">
              Create Category
            </Link>
          </li> */}
          <li className="list-group-item">
            <Link className="nav-link" to="/supplier">
              Manage Categories
            </Link>
          </li>
          {/* <li className="list-group-item">
            <Link className="nav-link" to="/create/product">
              Create Product
            </Link>
          </li> */}
          <li className="list-group-item">
            <Link className="nav-link" to="/branch">
              Manage Products
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/adminx1/orders">
              View Orders
            </Link>
          </li>
          {/* <li className="list-group-item">
            <Link
              className="nav-link"
              to="/admin/orderschart"
              // userId={id}
              // token={token}
            >
              Orders Chart
            </Link>
          </li> */}
        </ul>
      </div>
    );
  };

  const adminInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          {showLoading()}
          {showError()}
          <li className="list-group-item">Name:&nbsp;{user.name}</li>
          <li className="list-group-item">Email:&nbsp;{email}</li>
          <li className="list-group-item">
            Role:&nbsp;
            {Object.values(role) === "ROLE_ADMIN" ? "Registered User" : "Admin"}
          </li>
        </ul>
      </div>
    );
  };

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
    <AdminLayout
      title="Admin Dashboard"
      description={`Admin Dashboard of ${user.name}!`}
      className="container-fluid"
    >
      <div className="row p-5 card-container">
        <div className="col-4">{adminLinks()}</div>
        <div className="col-8">{adminInfo()}</div>
      </div>
      <Footer className="container-fluid" />
    </AdminLayout>
  );
};

export default AdminDashboard;
