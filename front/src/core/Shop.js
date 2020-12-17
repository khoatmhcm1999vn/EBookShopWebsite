import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import Card from "./Card";

import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./fixedPrices";

import { getCategories, getFilteredProducts } from "./apiCore";

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { categories: [], price: [] },
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);

  const [loading, setLoading] = useState(true);

  // console.log(myFilter.filters);

  const init = () => {
    // Get the categories from API
    getCategories().then((data) => {
      if (!data) {
        setError("fail");
        setLoading(true);
      } else {
        // console.log(data);
        setCategories(data);
        setError("");
        setLoading(false);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    console.log(newFilters);
    // Get the filtered products from API
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (!data) {
        setError("fail");
        setLoading(true);
      } else {
        setFilteredResults(data.data);
        // for Load More button, size from the API
        setSize(data.size);
        setSkip(0);
        setError("");
        setLoading(false);
      }
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    console.log(toSkip);
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
        setLoading(true);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
        setLoading(false);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-warning mb-5">
          {showError()}
          Load more
          {showLoading()}
        </button>
      )
    );
  };

  const catchError = (error) => {
    setError({ error: error });
  };

  const showLoading = () =>
    loading && (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  const handleFilters = (filters, filterBy) => {
    // console.log("SHOP", filters, filterBy);
    const newFilters = { ...myFilters };
    // push ids from checkbox component to the state
    newFilters.filters[filterBy] = filters;
    setLoading(true);

    if (filterBy === "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
      // setLoading(true)
    }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = (value) => {
    const data = prices;
    let array = [];
    // 1. loop over the keys in the defaultPrice and find the price range that match the id
    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    setLoading(true);
    return array;
  };

  const showError = () => error && <h2>Fail to load!</h2>;

  return (
    <Layout
      title="Shop Page"
      description="Search and find books of your choice"
      className="container-fluid"
    >
      <div className="text-center">
        <div className="m-3">
          <h1 className="title">Filter By </h1>
        </div>

        <div className="container-fluid ml-0 row mark d-flex justify-content-center align-content-center">
          {showError()}
          <Checkbox
            categories={categories}
            handleFilters={(filters) => handleFilters(filters, "category")}
          />
          {showLoading()}
        </div>

        <div className="container-fluid ml-0 row  mark d-flex justify-content-center align-content-center">
          {showError()}
          <RadioBox
            prices={prices}
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
          {showLoading()}
        </div>

        <div className="row m-3 card-container">
          {filteredResults.map((product, i) => (
            <div className="col-4 mb-3" key={i}>
              {showError()}
              <Card product={product} />
              {showLoading()}
            </div>
          ))}
        </div>

        {showError()}
        {loadMoreButton()}
        {showLoading()}
      </div>

      {/* <div className="row">
        <div className="col-4">
          <h4>Filter by categories</h4>
          <ul>
            <Checkbox
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, "category")}
            />
          </ul>

          <h4>Filter by price range</h4>
          <div>
            <RadioBox
              prices={prices}
              handleFilters={(filters) => handleFilters(filters, "price")}
            />
          </div>
        </div>

        <div className="col-8">
          <h2 className="mb-4">Products</h2>
          <div className="row">
            {filteredResults.map((product, i) => (
              <div key={i} className="col-4 mb-3">
                <Card product={product} />
              </div>
            ))}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div> */}
    </Layout>
  );
};

export default Shop;
