import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout/AdminLayout";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token)
      .then((data) => {
        if (!data) {
          // console.log(data.error);
          // setError(data.error);
          setError("fail");
          setLoading(true);
        } else {
          // console.log(data);
          setError("");
          setLoading(false);
          setOrders(data);
        }
      })
      .catch(catchError());
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token)
      .then((data) => {
        if (!data) {
          // console.log(data.error);
          setError("fail");
          setLoading(true);
        } else {
          // console.log(data);
          setError("");
          setLoading(false);
          setStatusValues(data);
        }
      })
      .catch(catchError());
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const catchError = (error) => {
    setError({ error: error });
  };

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <h1 className="text-danger display-2">Total orders: {orders.length}</h1>
      );
    } else {
      return <h1 className="text-danger">No orders</h1>;
    }
  };

  const showInput = (key, value) => {
    return (
      <div className="input-group mb-2 mr-sm-2">
        <div className="input-group-prepend">
          <div className="input-group-text">{key}</div>
          <input type="text" value={value} className="form-control" readOnly />
        </div>
      </div>
    );
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

  const handleStatusChange = (e, orderId) => {
    // console.log("Update order status");
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        loadOrders();
      }
    });
  };

  const showStatus = (o) => {
    return (
      <div className="form-group">
        <h3 className="mark mb-2">Status: {o.status}</h3>
        <select
          className="form-control"
          onChange={(e) => handleStatusChange(e, o._id)}
        >
          <option>Update Status</option>
          {statusValues.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <AdminLayout
      title="Orders"
      description={`Admin Dashboard of ${user.name}!, you can manage all the orders here`}
    >
      {showOrdersLength()}
      <Link
        to="/admin/dashboard"
        className="btn btn-outline-warning float-left"
      >
        Back
      </Link>
      {showLoading()}
      {showError()}
      {orders.map((o) => {
        return (
          <div className="row m-2" key={o._id}>
            <div className="col-6">
              <h4 className="mb-3 text-primary">
                <span className="">Order ID: {o._id}</span>
              </h4>

              <ul className="list-group mb-2">
                <li className="list-group-item text-danger">{showStatus(o)}</li>
                <li className="list-group-item">
                  Transaction ID: {o.transaction_id}
                </li>
                <li className="list-group-item">Amount: ${o.amount}</li>
                <li className="list-group-item">Ordered by: {o.user.name}</li>
                <li className="list-group-item">
                  Ordered on: {moment(o.createdAt).fromNow()}
                </li>
                <li className="list-group-item">
                  Delivery address: {o.address}
                </li>
              </ul>
            </div>
            <div className="col-6 m-auto">
              <h3 className="mt-4 mb-4 font-italic">
                Total products in the order: {o.products.length}
              </h3>
              {o.products.map((p) => (
                <div key={p._id}>
                  {showInput("Name", p.name)}
                  {showInput("Price", `$${p.price}`)}
                  {showInput("Count", p.count)}
                  {showInput("ID", p._id)}
                </div>
              ))}
            </div>
            <hr style={{ borderBottom: "3px solid indigo", width: "50%" }} />
          </div>
        );
      })}

      {/* <div className="row">
        <div className="col-md-8 offset-md-2">
          {showOrdersLength()}

          {orders.map((o, oIndex) => {
            return (
              <div
                className="mt-5"
                key={oIndex}
                style={{ borderBottom: "5px solid indigo" }}
              >
                <h2 className="mb-5">
                  <span className="bg-primary">Order ID: {o._id}</span>
                </h2>
                <li className="list-group-item">{showStatus(o)}</li>
                <ul className="list-group mb-2">
                  <li className="list-group-item">
                    Transaction ID: {o.transaction_id}
                  </li>
                  <li className="list-group-item">Amount: ${o.amount}</li>
                  <li className="list-group-item">Ordered by: {o.user.name}</li>
                  <li className="list-group-item">
                    Ordered on: {moment(o.createdAt).fromNow()}
                  </li>
                  <li className="list-group-item">
                    Delivery address: {o.address}
                  </li>
                </ul>

                <h3 className="mt-4 mb-4 font-italic">
                  Total products in the order: {o.products.length}
                </h3>

                {o.products.map((p, pIndex) => (
                  <div
                    className="mb-4"
                    key={pIndex}
                    style={{ padding: "20px", border: "1px solid indigo" }}
                  >
                    {showInput("Product name", p.name)}
                    {showInput("Product price", p.price)}
                    {showInput("Product total", p.count)}
                    {showInput("Product Id", p._id)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div> */}
      <Footer className="container-fluid" />
    </AdminLayout>
  );
};

export default Orders;
