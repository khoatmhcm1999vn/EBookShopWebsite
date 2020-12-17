import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Link, Redirect } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { getCategory, updateCategory } from "./apiAdmin";

const UpdateCategory = ({ match }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  useEffect(() => {
    getCategory(match.params.categoryId).then((data) => {
      if (data.error) {
        console.log(data.error);
        setError(true);
      } else {
        setName(data.name);
      }
    });
  }, []);

  const handleChange = (e) => {
    setError("");
    setName(e.target.value);
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    //request an API call
    updateCategory(user._id, token, match.params.categoryId, { name }).then(
      (data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setError("");
          setSuccess(true);
        }
      }
    );
  };

  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Category Name
        </label>
        <input
          type="text"
          className="form-control"
          autoFocus
          value={name}
          onChange={handleChange}
          required
        />
      </div>
      <Link
        to="/admin/categories"
        className="btn btn-outline-warning float-left"
      >
        Back
      </Link>
      <button className="btn btn-outline-primary float-right">Update</button>
    </form>
  );

  const showSuccess = () => {
    if (success)
      return <h3 className="text-success">{name} is updated successfully!</h3>;
  };

  const showError = () => {
    if (error) return <h3 className="text-danger">{error}</h3>;
  };

  return (
    <Layout
      title="Update a category"
      description={`Admin Dashboard of ${user.name}!, ready update exist category`}
    >
      <div className="container w-50">
        <h1 className="title m-3 text-center">Update Category</h1>
        {showError()}
        {showSuccess()}
        {newCategoryForm()}
      </div>
    </Layout>
  );
};
export default UpdateCategory;
