import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";

import Card from "./Card";
import Checkout from "./Checkout";

import { getCart } from "./cartHelpers";

const Cart = () => {
  const [items, setItems] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [run, setRun] = useState(false);

  useEffect(() => {
    console.log("MAX DEPTH ...");
    setItems(getCart());
  }, [run]);

  const showItems = (items) => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr />
        <div className="row">
          {items.map((product, i) => (
            <div className="col-4" key={product._id}>
              <Card
                key={i}
                product={product}
                showAddToCartButton={false}
                cartUpdate={true}
                showRemoveProductButton={true}
                setRun={setRun}
                run={run}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const catchError = (error) => {
    setError({ error: error });
  };

  const noItemsMessage = () => {
    return (
      <h2>
        Your cart is currently empty. <br />{" "}
        <Link to="/shop">Continue shopping</Link>
      </h2>
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

  return (
    <Layout
      title="Shopping Cart"
      description="Checkout now!"
      className="container-fluid"
    >
      <div className="text-center m-3">
        <div className="">
          <h1 className="title p-2">Your Cart Summary</h1>
          <Checkout products={items} setRun={setRun} />
        </div>

        <div className="mt-4">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>
      </div>
      {/* <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>

        <div className="col-6">
          <h2 className="mb-4">Your Cart Summary</h2>
          <hr />
          <Checkout products={items} setRun={setRun} />
        </div>
      </div> */}
    </Layout>
  );
};

export default Cart;
