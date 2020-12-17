import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";
import moment from "moment";

import { isAuthenticated } from "../auth";
import { read, getPurchaseHistory } from "./apiUser";

const UserDashboard = () => {
  const [history, setHistory] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");

  const {
    user: { name, email, role, _id },
  } = isAuthenticated();

  const token = isAuthenticated().token;

  const init = (userId, token) => {
    getPurchaseHistory(userId, token).then((data) => {
      if (!data) {
        // console.log(data.error);
        setError("fail");
      } else {
        setLoading(false);
        setHistory(data);
      }
    });
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

  const userLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">User Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/cart">
              My Cart
            </Link>
          </li>
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
        </ul>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className="card mb-5 card-dashboard">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          {/* <h2>{JSON.stringify(user)}</h2> */}
          {showLoading()}
          {showError()}
          <li className="list-group-item">Name:&nbsp;{user.name}</li>
          <li className="list-group-item">Email:&nbsp;{email}</li>
          <li className="list-group-item">
            Role:&nbsp;
            {Object.values(role) === "admin" ? "Admin" : "Registered User"}
          </li>
        </ul>
      </div>
    );
  };

  const purchaseHistory = (history) => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">Purchase History</h3>
        <ul className="list-group">
          <li className="list-group-item">
            {showLoading()}
            {showError()}
            {history.map((h, i) => {
              return (
                <div key={h._id}>
                  <h3>Total Products:&nbsp;{h.items.length}</h3>
                  <hr />
                  {h.items.map((p, i) => {
                    return (
                      <div key={p._id}>
                        {/* <h6>Product name: {p.name}</h6> */}
                        <h2>{p.product.name}</h2>
                        <h6>Product price: ${p.payablePrice}</h6>
                        <h6>Purchased date: {moment(h.createdAt).fromNow()}</h6>
                        <hr />
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <hr />
            {/* {JSON.stringify(history)} */}
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
    <Layout
      title="User Dashboard"
      description={`User Dashboard of ${user.name}!`}
      className="container-fluid"
    >
      <div className="row p-5 card-container">
        <div className="col-4">{userLinks()}</div>
        <div className="col-8">
          {userInfo()}
          {purchaseHistory(history)}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
