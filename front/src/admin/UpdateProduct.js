import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Link, Redirect } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";
// import { propTypes } from "react-bootstrap/esm/Image";

const UpdateProduct = ({ match, categoryId }) => {
  const [values, setValues] = useState({
    name: "",
    published: false,
    description: "",
    price: "",
    categories: [],
    category: "5faa506dbe7e431610f9d113",
    shipping: "",
    quantity: "",
    image: "",
    loading: false,
    error: "",
    updatedProduct: "",
    redirectToProfile: false,
    formData: "",
  });

  const { user, token } = isAuthenticated();

  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    loading,
    error,
    updatedProduct,
    redirectToProfile,
    formData,
  } = values;

  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // populate the state
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          shipping: data.shipping,
          quantity: data.quantity,
          formData: new FormData(),
        });
        // load categories
        initCategories();
      }
    });
  };

  // load categories and set form data
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ categories: data, formData: new FormData() });
      }
    });
  };

  useEffect(() => {
    init(match.params.productId);
    initCategories();
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    console.log(values);
    console.log(values.category);

    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            image: "",
            price: "",
            quantity: "",
            loading: false,
            // error: false,
            redirectToProfile: true,
            updatedProduct: data.name,
          });
        }
      }
    );
  };

  const newPostForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            onChange={handleChange("image")}
            type="file"
            name="image"
            accept="image/*"
          />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          onChange={handleChange("description")}
          className="form-control"
          value={description}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Price</label>
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          value={price}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Price</label>
        <input
          onChange={handleChange("category")}
          type="text"
          className="form-control"
          value={category}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Category</label>
        <select
          defaultValue={category}
          onChange={handleChange("category")}
          className="form-control"
        >
          <option>Please select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id} defaultValue={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select onChange={handleChange("shipping")} className="form-control">
          <option>Please select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input
          onChange={handleChange("quantity")}
          type="number"
          className="form-control"
          value={quantity}
        />
      </div>

      <Link to="/admin/products" className="btn btn-outline-warning float-left">
        Back
      </Link>

      <button className="btn btn-outline-primary float-right mb-3">
        Update Product
      </button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: updatedProduct ? "" : "none" }}
    >
      <h2>{`${updatedProduct}`} is updated successfully!</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  const redirectUser = () => {
    if (redirectToProfile) {
      if (!error) {
        return <Redirect to="/" />;
      }
    }
  };

  return (
    <Layout
      title="Update a product"
      description={`Admin Dashboard of ${user.name}!, ready update exist product`}
    >
      <div className="container w-50">
        <h1 className="title p-2 text-center">Update Product</h1>
        {showLoading()}
        {showSuccess()}
        {showError()}
        {newPostForm()}
      </div>
      {/* <div className="row">
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
          {redirectUser()}
        </div>
      </div> */}
    </Layout>
  );
};

export default UpdateProduct;
