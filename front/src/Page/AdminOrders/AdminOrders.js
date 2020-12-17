import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerOrders, updateOrder } from "../../actions";
import AdminLayout from "../../AdminLayout/AdminLayout";
import Card from "../../Card/Card";

import { Link } from "react-router-dom";

import { isAuthenticated } from "../../auth";
import {
  listOrders,
  getStatusValues,
  updateOrderStatus,
} from "../../admin/apiAdmin";

import "./AdminOrders.css";

/**
 * @author
 * @function Orders
 **/

const AdminOrders = (props) => {
  const order = useSelector((state) => state.order);
  const [type, setType] = useState("");
  const dispatch = useDispatch();

  // const { token } = isAuthenticated();

  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { user, token } = isAuthenticated();

  const onOrderUpdate = (orderId) => {
    const payload = {
      orderId,
      type,
    };
    dispatch(updateOrder(user._id, token, payload));
  };

  // const loadOrders = () => {
  //   listOrders(user._id, token)
  //     .then((data) => {
  //       if (!data) {
  //         // console.log(data.error);
  //         // setError(data.error);
  //         setError("fail");
  //         setLoading(true);
  //       } else {
  //         // console.log(data);
  //         setError("");
  //         setLoading(false);
  //         setOrders(data);
  //       }
  //     })
  //     .catch(catchError());
  // };

  const loadData = () => dispatch(getCustomerOrders(user._id, token));

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
    // loadOrders();
    dispatch(getCustomerOrders(user._id, token));
    loadStatusValues();
  }, []);

  const catchError = (error) => {
    setError({ error: error });
  };

  const showOrdersLength = () => {
    if (order.orders.length > 0) {
      return (
        <h1 className="text-danger display-2">
          Total orders: {order.orders.length}
        </h1>
      );
    } else {
      return <h1 className="text-danger">No orders</h1>;
    }
  };

  const formatDate = (date) => {
    if (date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
    return "";
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
        // loadOrders();
        dispatch(getCustomerOrders(user._id, token));
      }
    });
  };

  const showStatus = (o) => {
    return (
      <div className="form-group">
        <h3 className="mark mb-2">Status: {o.paymentStatus}</h3>
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
      title="Manage Orders"
      description="Track Order"
      className="container-fluid"
    >
      {showOrdersLength()}
      <Link
        to="/admin/dashboard"
        className="btn btn-outline-warning float-left"
      >
        Back
      </Link>
      <button onClick={loadData}>Load Data</button>
      {showLoading()}
      {showError()}
      {order.orders.map((orderItem, index) => (
        <Card
          style={{
            margin: "10px 0",
          }}
          key={index}
          headerLeft={orderItem._id}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "50px 50px",
              alignItems: "center",
            }}
          >
            <div>
              <div className="title">Items</div>
              {orderItem.items.map((item, index) => (
                <div className="value" key={index}>
                  {item.product.name}
                </div>
              ))}
            </div>
            <div>
              <span className="title">Total Price</span>
              <br />
              <span className="value">{orderItem.totalAmount}</span>
            </div>
            <div>
              <span className="title">Payment Type</span> <br />
              <span className="value">{orderItem.paymentType}</span>
            </div>
            <div>
              <span className="title">Payment Status</span> <br />
              <span className="value">{orderItem.paymentStatus}</span>
            </div>
            <div>
              <li className="list-group-item text-danger">
                {showStatus(orderItem)}
              </li>
            </div>
          </div>
          <div
            style={{
              boxSizing: "border-box",
              padding: "100px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="orderTrack">
              {orderItem.orderStatus.map((status) => (
                <div
                  className={`orderStatus ${
                    status.isCompleted ? "active" : ""
                  }`}
                >
                  <div
                    className={`point ${status.isCompleted ? "active" : ""}`}
                  ></div>
                  <div className="orderInfo">
                    <div className="status">{status.type}</div>
                    <div className="date">{formatDate(status.date)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* select input to apply order action */}
            <div
              style={{
                padding: "0 50px",
                boxSizing: "border-box",
              }}
            >
              <select onChange={(e) => setType(e.target.value)}>
                <option value={""}>select status</option>
                {orderItem.orderStatus.map((status) => {
                  return (
                    <>
                      {!status.isCompleted ? (
                        <option key={status.type} value={status.type}>
                          {status.type}
                        </option>
                      ) : null}
                    </>
                  );
                })}
              </select>
            </div>
            {/* button to confirm action */}

            <div
              style={{
                padding: "0 50px",
                boxSizing: "border-box",
              }}
            >
              <button onClick={() => onOrderUpdate(orderItem._id)}>
                confirm
              </button>
            </div>
          </div>
        </Card>
      ))}
    </AdminLayout>
  );
};

export default AdminOrders;
