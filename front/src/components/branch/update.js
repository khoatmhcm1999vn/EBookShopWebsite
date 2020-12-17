import React, { useState, useEffect } from "react";
import { Field, Formik } from "formik";

import { useSelector, useDispatch } from "react-redux";
import * as branchActions from "../../actions/branch.action";
import { server } from "../../constants";

import { isAuthenticated } from "../../auth";

import { Link } from "react-router-dom";

import AdminLayout from "../../AdminLayout/AdminLayout";
import Footer from "../../Footer/Footer";

import Sidebar from "../sidebar/sidebar";

import Select from "react-select";

export default (props) => {
  const dispatch = useDispatch();
  const [multiselect, setMultiselect] = useState([]);
  const branchReducer = useSelector(({ branchReducer }) => branchReducer);

  // const [user, setUser] = useState({});

  const options = [
    { key: "No", value: false },
    { key: "Yes", value: true },
  ];

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      return props.history.push("/login");
    }
    const { id } = props.match.params;
    // dispatch(branchActions.getDropdownPOS())
    dispatch(branchActions.getSingleBranch(id));
    dispatch(branchActions.clearState());
    // dispatch(branchActions.getSingleBranch(id))
  }, []);

  useEffect(() => {
    if (branchReducer.result) {
      let initial_image = {
        file_obj: "",
        imageUrl: branchReducer.result.imageUrl,
      };
      showPreviewImage(initial_image);
    }
  }, [branchReducer]);

  const showPreviewImage = (values) => {
    return (
      <img
        id="imageUrl"
        src={
          values.file_obj != null
            ? values.file_obj
            : "http://localhost:8090/images/" + values.imageUrl
        }
        class="img-fluid"
        width={300}
        alt=""
      />
    );
  };

  const renderSelectwithSelected = () => {
    if (branchReducer.result) {
      return (
        <div class="form-group ">
          <Select
            key="category"
            id="category"
            name="category"
            defaultValue={
              branchReducer.result
                ? branchReducer.result.category.map((val) => {
                    return {
                      value: val._id,
                      label: val.name,
                    };
                  })
                : null
            }
            onChange={setMultiselect}
            isMulti
            closeMenuOnSelect={false}
            options={branchReducer.options ? branchReducer.options : null}
          />
        </div>
      );
    } else {
      return null; // or loading graphic
    }
  };

  const { user, token } = isAuthenticated();

  const showForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  }) => {
    return (
      <form role="form" onSubmit={handleSubmit}>
        <div class="card-body">
          <input
            type="hidden"
            name="_id"
            onChange={handleChange}
            value={values._id}
          />
          <div className="form-group input-group has-feedback">
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={values.name}
              className="form-control"
              placeholder="Branch Name"
              className={
                errors.alias && touched.alias
                  ? "form-control is-invalid"
                  : "form-control"
              }
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-building"></span>
              </div>
            </div>
            {errors.name && touched.name ? (
              <small id="passwordHelp" class="text-danger">
                {errors.name}
              </small>
            ) : null}
          </div>

          <div class="form-group ">
            <Field
              as="select"
              name="published"
              id="published"
              onChange={(e) => {
                const { value } = e.target;
                setFieldValue("published", value);
              }}
            >
              {options.map((option) => {
                return (
                  <option key={option.key} value={option.value}>
                    {option.key}
                  </option>
                );
              })}
            </Field>
          </div>

          <div className="form-group input-group has-feedback">
            <textarea
              name="description"
              onChange={handleChange}
              value={values.description}
              className="form-control"
              placeholder="Description"
              className={
                errors.description && touched.description
                  ? "form-control is-invalid"
                  : "form-control"
              }
            ></textarea>
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-building"></span>
              </div>
            </div>
            {errors.description && touched.description ? (
              <small id="passwordHelp" class="text-danger">
                {errors.address}
              </small>
            ) : null}
          </div>

          <div className="form-group input-group has-feedback">
            <input
              type="number"
              name="quantity"
              onChange={handleChange}
              value={values.quantity}
              className="form-control"
              placeholder="Product Quantity"
              className={
                errors.quantity && touched.quantity
                  ? "form-control is-invalid"
                  : "form-control"
              }
            />
            <div class="input-group-append col-3">
              <div class="input-group-text">
                <span class="fas fa-phone"></span>
              </div>
            </div>
            {errors.quantity && touched.quantity ? (
              <small id="passwordHelp" class="text-danger">
                {errors.quantity}
              </small>
            ) : null}
          </div>

          <div className="form-group input-group has-feedback">
            <input
              type="number"
              name="price"
              onChange={handleChange}
              value={values.price}
              className="form-control"
              placeholder="Product Price"
              className={
                errors.price && touched.price
                  ? "form-control is-invalid"
                  : "form-control"
              }
            />
            <div class="input-group-append col-3">
              <div class="input-group-text">
                <span class="fas fa-phone"></span>
              </div>
            </div>
            {errors.price && touched.price ? (
              <small id="passwordHelp" class="text-danger">
                {errors.price}
              </small>
            ) : null}
          </div>

          {renderSelectwithSelected()}
          {/* <h2>{JSON.stringify(branchReducer)}</h2> */}

          <div class="form-group ">{showPreviewImage(values)}</div>

          <div class="form-group ">
            <div class="input-group col-5">
              <div class="custom-file">
                <input
                  type="file"
                  onChange={(e) => {
                    e.preventDefault();
                    setFieldValue("imageUrl", e.target.files[0]); // for upload
                    setFieldValue(
                      "file_obj",
                      URL.createObjectURL(e.target.files[0])
                    ); // for preview image
                  }}
                  name="imageUrl"
                  className={
                    errors.imageUrl && touched.imageUrl
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  accept="image/*"
                  id="exampleInputFile"
                />
                <label class="custom-file-label" for="exampleInputFile">
                  Choose Front Image
                </label>
              </div>
            </div>
          </div>

          <div class="row">
            <a href="/branch" className="btn btn-outline-warning float-left">
              Back
            </a>
            <div class="offset-md-4 col-4">
              <button
                type="submit"
                disabled={isSubmitting}
                class="btn btn-primary btn-block"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  };

  return (
    <>
      <AdminLayout
        title="Update a product"
        description={`Admin Dashboard of ${user.name}!, ready update exist product`}
      />
      <div className="">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              {/* <h1 className="m-0 text-dark">Update Product Data</h1> */}
            </div>
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      <div className="content">
        <div class="card card-primary">
          <div class="card-header"></div>

          <Formik
            enableReinitialize={true}
            initialValues={
              branchReducer.result
                ? branchReducer.result
                : { name: "", tel: "", address: "" }
            }
            onSubmit={(values, { setSubmitting }) => {
              let formData = new FormData();
              if (values.quantity < 1) {
                values.quantity = 1;
              }
              if (values.price < 1) {
                values.price = 0;
              }
              formData.append("id", branchReducer.result._id);
              formData.append("name", values.name);
              formData.append("published", values.published);
              formData.append("description", values.description);
              formData.append("quantity", values.quantity);
              formData.append("price", values.price);
              let result = multiselect.map((arr) => arr.value);

              formData.append("category", result);
              if (values.imageUrl) {
                formData.append("imageUrl", values.imageUrl);
              }
              console.log(values.imageUrl);
              console.log(formData);
              console.log(branchReducer.result._id);
              dispatch(
                branchActions.Update(user._id, token, formData, props.history)
              );
              setSubmitting(false);
            }}
            // validationSchema={Create_Schema}
          >
            {/* {this.showForm()}            */}
            {(props) => showForm(props)}
          </Formik>
        </div>
        {/* /.card */}
      </div>
    </>
  );
};
