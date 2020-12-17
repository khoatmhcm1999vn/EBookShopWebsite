import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";
import Card from "./Card";

import {
  getProducts,
  getBraintreeClientToken,
  processPayment,
  createOrder,
} from "./apiCore";
import { emptyCart } from "./cartHelpers";
import { isAuthenticated } from "../auth";

import DropIn from "braintree-web-drop-in-react"; //https://www.npmjs.com/package/braintree-web-drop-in-react

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;
  const roles = isAuthenticated() && isAuthenticated().user.roles;

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (!data) {
        // console.log(data.error);
        setData({ ...data, error: "fail" });
      } else {
        console.log(data);
        setData({ clientToken: data.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const handleAddress = (event) => {
    setData({ ...data, address: event.target.value });
  };

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return Math.round(currentValue + nextValue.count * nextValue.price);
    }, 0);
  };

  // isAuthenticated().user.roles.includes("ROLE_USER")

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/login">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };

  let deliveryAddress = data.address;

  const buy = () => {
    // send the nonce to your server
    // nonce = data.instance.requestPaymentMethod()
    setData({ loading: true });
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        console.log(data);
        nonce = data.nonce;
        // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
        // and also total to be charged
        // console.log(
        //   "Send nonce and total to process: ",
        //   nonce,
        //   getTotal(products)
        // );

        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products),
        };

        processPayment(userId, token, paymentData).then((response) => {
          console.log(response);

          setData({ ...data, success: response.success });
          // empty cart
          // create order

          const createOrderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount,
            address: deliveryAddress,
            // address: data.address
          };

          createOrder(userId, token, createOrderData)
            .then((response) => {
              emptyCart(() => {
                setRun(!run); // run useEffect in parent Cart // re-render localstorage
                console.log("Payment success and Empty Cart");
                setData({ loading: false, success: true });
              });
            })
            .catch((error) => {
              console.log(error);
              setData({ loading: false });
            });
        });
      })
      .catch((error) => {
        console.log("DropIn error: ", error);
        setData({ ...data, error: error.message });
      });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })} className="w-50 m-auto">
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="form-group mb-3">
            <label className="text-muted">Delivery address:</label>
            <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your delivery address here..."
            />
          </div>

          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault",
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success btn-block pt-2">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showError = (error) => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  };

  const showSuccess = (success) => {
    return (
      <div
        className="alert alert-info"
        style={{ display: success ? "" : "none" }}
      >
        Thank! Your payment was successful!
      </div>
    );
  };

  const showLoading = (loading) =>
    loading && (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container-fluid">
      <h2>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
