import React, { useState, useEffect, useLayoutEffect } from "react";
import Layout from "../Layout/Layout";

import { useDispatch, useSelector } from 'react-redux'

import { Link } from "react-router-dom";

import Card from "./Card";
import Search from "./Search";
import Paginator from "../Paginator/Paginator";

import Chart from "./Chart";

import Footer from "../Footer/Footer";

// import axios from "axios";
import moment from "moment";

import { getProducts, listProducts, getAll } from "./apiCore";

import {
  listOrders,
  getStatusValues,
  updateOrderStatus,
  listOrdersChart,
} from "../admin/apiAdmin";

import Pagination from "@material-ui/lab/Pagination";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchName, setSearchName] = useState("");

  // const [orders, setOrders] = useState([]);
  // const [statusValues, setStatusValues] = useState([]);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [chart, setChart] = useState({});

  // const [googleData, setGoogleData] = useState();

  // const { user, token } = isAuthenticated();

  useLayoutEffect(() => {
    getData();
  }, []);

  const getData = () => {
    // const res = await listOrdersChart();

    fetch(`http://localhost:8090/api/sold`)
      .then((res) => {
        if (res.error) {
          setError(res.error);
        }
        setLoading(false);
        return res.json();
      })
      .then((jsonarray) => {
        var labels = jsonarray.map(function (e) {
          // return moment(e.createdAt).fromNow();
          return e.name;
        });

        // let abc = [];
        // var a = [];
        var data = jsonarray.map(function (e, i) {
          return e.sold;
        });

        console.log(data);

        console.log(labels, data);
        // console.log(labels);

        setChart({
          // labels: Object.keys(res.data[0]),
          labels: labels,
          datasets: [
            {
              label: "Orders Web Vladimir Khoa",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              // data: Object.values(res.data[0]),
              data: Object.values(data),
            },
          ],
        });
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const pageSizes = [3, 6, 9];

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
    setError(false);
    setLoading(false);
  };

  const getRequestParams = (searchName, page, pageSize) => {
    let params = {};

    if (searchName) {
      params["name"] = searchName;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };

  const retrieveProducts = () => {
    const params = getRequestParams(searchName, page, pageSize);

    getAll(params)
      .then((response) => {
        if (response.error) {
          setError(response.error);
        }

        const { products, totalPages } = response.data;

        setLoading(false);
        setProducts(products);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(retrieveProducts, [page, pageSize]);

  const refreshList = () => {
    retrieveProducts();
    setCurrentProduct(null);
    setCurrentIndex(-1);
  };

  const setActiveProduct = (product, index) => {
    setCurrentProduct(product);
    setCurrentIndex(index);
  };

  // const removeAllProducts = () => {
  //   removeAll()
  //     .then((response) => {
  //       console.log(response.data);
  //       refreshList();
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  const handlePageChange = (event, value) => {
    setPage(value);
    setLoading(true);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
    setLoading(true);
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
      title="Home Page"
      description="Node React"
      className="container-fluid"
    >
      {/* <Search /> */}

      <div>
        {showError()}
        <Chart data={chart} />
        {showLoading()}
      </div>

      {/* <div>
          <Chart data={this.state.chart} />
        </div> */}

      <div className="list row">
        <div className="col-md-10">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name"
              value={searchName}
              onChange={onChangeSearchName}
            />
            {showLoading()}
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={retrieveProducts}
              >
                Search
                {showLoading()}
              </button>
            </div>
          </div>
        </div>
        <div className="container-fluid row m-0 p-0 card-container">
          <h4>Products List</h4>

          <div className="mt-3">
            {"Items per Page: "}
            {showLoading()}
            <select onChange={handlePageSizeChange} value={pageSize}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            {/* {showError()}
            <h2 className="mb-4">New Arrivals</h2>
            <div className="row">
              {productsByArrival.map((product, i) => (
                <div key={i} className="col-4 mb-3">
                  <Card product={product} />
                </div>
              ))}
            </div>

            <h2 className="mb-4">Best Sellers</h2>
            <div className="row">
              {productsBySell.map((product, i) => (
                <div key={i} className="col-4 mb-3">
                  <Card product={product} />
                </div>
              ))}
            </div> */}

            {showError()}
            <h2 className="mb-4">Product Show</h2>
            {showLoading()}
            <div className="container-fluid row m-0 p-0 card-container">
              {products &&
                products.map((product, index) => (
                  <div key={index} className="col-6 mb-3">
                    {showError()}
                    <Card product={product} />
                    {showLoading()}
                  </div>
                ))}
            </div>

            {/* <Footer /> */}

            <Pagination
              className="container-fluid row m-0 p-0 card-container"
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              showFirstButton
              showLastButton
              onChange={handlePageChange}
            />
            {showLoading()}
          </div>

          {/* <ul className="list-group">
            {products &&
              products.map((product, index) => (
                <li
                  // className={
                  //   "list-group-item " + (index === currentIndex ? "active" : "")
                  // }
                  // onClick={() => setActiveProduct(product, index)}
                  key={index}
                >
                  {product.name}
                </li>
              ))}
          </ul> */}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
