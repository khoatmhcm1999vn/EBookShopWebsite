import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";

import { Link } from "react-router-dom";

import Card from "./Card";
import Search from "./Search";
import Paginator from "../Paginator/Paginator";

import Chart from "./Chart";

// import axios from "axios";
import moment from "moment";

import { getProducts, listProducts, getAll } from "./apiCore";

import Pagination from "@material-ui/lab/Pagination";

const BestSeller = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProductsBySell = () => {
    getProducts("sold")
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setLoading(true);
        } else {
          setLoading(false);
          setProductsBySell(data);
        }
      })
      .catch(catchError);
  };

  const catchError = (error) => {
    setError({ error: error });
  };

  const loadProductsByArrival = () => {
    getProducts("createdAt")
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setLoading(true);
        } else {
          setLoading(false);
          setProductsByArrival(data);
        }
      })
      .catch(catchError);
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

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
      title="Best Seller Page"
      description="Best Seller"
      className="container-fluid"
    >
      <Search />

      <div>
        {showError()}
        <h1 className="title pt-3 pb-3">New Arrivals</h1>
        {showLoading()}

        <div className="container-fluid row m-0 p-0 card-container">
          {productsByArrival.map((product, i) => (
            <div className="col-4 mb-3" key={i}>
              <Card product={product} />
            </div>
          ))}
        </div>

        <h1 className="title pt-3 pb-3">Best Sellers</h1>
        {showLoading()}
        <div className="container-fluid row m-0 p-0 card-container">
          {productsBySell.map((product, i) => (
            <div className="col-4 mb-3" key={i}>
              <Card product={product} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BestSeller;
