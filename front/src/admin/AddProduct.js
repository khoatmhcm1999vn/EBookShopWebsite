import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";

import ImageUpload from "../FormElements/ImageUpload";

import ShowImage from "../core/ShowImage";
import FilePicker from "../FormElements/FilePicker";

import { generateBase64FromImage } from "../utils/image";

import { isAuthenticated } from "../auth";
import { createProduct, getCategories } from "./apiAdmin";

const AddProduct = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    shipping: "",
    quantity: "",
    image: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    imagePreview: null,
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
    imageUrl,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData,
  } = values;

  // load categories and set form data
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = (name) => (event) => {
    // if (files) {
    //   generateBase64FromImage(files[0])
    //     .then((b64) => {
    //       setValues({ imagePreview: b64 });
    //     })
    //     .catch((e) => {
    //       setValues({ imagePreview: null });
    //     });
    // }

    const value = name === "image" ? event.target.files[0] : event.target.value;

    // const value = event.target.value;

    formData.set(name, value);
    formData.get("name");
    console.log(formData);
    setValues({ ...values, [name]: value });
  };

  const handleFile = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value;

    formData.set(name, value);

    setValues({ ...values, image: value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    console.log(values);
    console.log(formData);
    // formData.append("image", values.imageUrl);
    console.log(formData);

    createProduct(user._id, token, formData).then((data) => {
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
          createdProduct: data.name,
        });
      }
    });
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

      {/* <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
        <label htmlFor={props.id}>{props.label}</label>
    <input
      className={[
        !props.valid ? "invalid" : "valid",
        props.touched ? "touched" : "untouched",
      ].join(" ")}
      type="file"
      id={props.id}
      onChange={(e) => props.onChange(props.id, e.target.value, e.target.files)}
      // onBlur={props.onBlur}
    />
          <div className="new-post__preview-image">
            {!values.imageUrl && <p>Please choose an image.</p>}
            {values.imageUrl && (
              <ShowImage imageUrl={values.imageUrl} contain left />
            )}
          </div> */}

      {/* <ImageUpload
            onChange={handleChange("imageUrl")}
            center
            id="image"
            onInput={handleChange("imageUrl")}
            errorText="Please provide an image."
            type="file"
            name="imageUrl"
            accept="image/*"
          /> */}
      {/* </label>
      </div> */}

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
        <label className="text-muted">Category</label>
        <select onChange={handleChange("category")} className="form-control">
          <option>Please select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
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

      <Link
        to="/admin/dashboard"
        className="btn btn-outline-warning float-left"
      >
        Back
      </Link>
      <button className="btn btn-outline-primary float-right mb-3">
        Create Product
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
      style={{ display: createdProduct ? "" : "none" }}
    >
      <h2>{`${createdProduct}`} is created!</h2>
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

  return (
    <Layout
      title="Add a new product"
      description={`Admin Dashboard of ${user.name}!, ready add new product`}
    >
      <div className="container w-50">
        <h1 className="title p-2 text-center">New Product</h1>
        {showLoading()}
        {showSuccess()}
        {showError()}
        {newPostForm()}
      </div>
    </Layout>
  );
};

export default AddProduct;
