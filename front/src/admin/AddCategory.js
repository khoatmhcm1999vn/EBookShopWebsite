import React, { useState } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { createCategory } from "./apiAdmin";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // destructure user and token from localStorage
  const { user, token } = isAuthenticated();

  const handleChange = (e) => {
    setError("");
    setName(e.target.value);
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    // make request to api to create category
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        console.log(data.error);
        setError(data.error);
      } else {
        setError("");
        setSuccess(true);
      }
    });
  };

  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Category Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          autoFocus
          required
        />
      </div>
      <Link
        to="/admin/dashboard"
        className="btn btn-outline-warning float-left"
      >
        Back
      </Link>
      <button className="btn btn-outline-primary float-right">
        Create Category
      </button>
    </form>
  );

  const showSuccess = () => {
    if (success) {
      return <h3 className="text-success">{name} is created successfully!</h3>;
    }
  };

  const showError = () => {
    if (error) {
      return <h3 className="text-danger">{error}</h3>;
    }
  };

  const goBack = () => {
    return (
      <div className="mt-5">
        <Link to="/admin/dashboard" className="text-warning">
          Back to Dashboard
        </Link>
      </div>
    );
  };

  return (
    <Layout
      title="Add a new category"
      description={`Admin Dashboard of ${user.name}!, ready add new category`}
    >
      <div className="container w-50">
        <h1 className="title m-3 text-center">New Category</h1>
        {showError()}
        {showSuccess()}
        {newCategoryForm()}
        {/* {goBack()} */}
      </div>

      {/* <div className="row">
        <div className="col-md-8 offset-md-2">
          {showSuccess()}
          {showError()}
          {newCategoryForm()}
        </div>
      </div> */}
    </Layout>
  );
};

export default AddCategory;
