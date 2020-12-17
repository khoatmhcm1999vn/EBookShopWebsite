import React, { useState, useEffect } from "react";
import * as supplierActions from "../../actions/supplier.action";
import { server } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import swal from "sweetalert";

import Layout from "../../Layout/Layout";
import AdminLayout from "../../AdminLayout/AdminLayout";
import Footer from "../../Footer/Footer";

import { isAuthenticated } from "../../auth";

import { getCategories, deleteCategory } from "../../admin/apiAdmin";

export default (props) => {
  const supplierReducer = useSelector(({ supplierReducer }) => supplierReducer);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCategories = () =>
    getCategories(token, isAuthenticated().user._id)
      .then((data) => {
        if (!data) {
          console.log(data);
          setError("fail");
          setLoading(true);
        } else {
          setError("");
          setLoading(false);
          setCategories(data);
        }
      })
      .catch(catchError());

  const catchError = (error) => {
    setError({ error: error });
  };

  useEffect(() => {
    if (localStorage.getItem(server.TOKEN_KEY) === null) {
      return props.history.push("/login");
    }
    // dispatch(supplierActions.Index());
    loadCategories();
  }, []);

  const { user, token } = isAuthenticated();

  // function confirmDelete(userId, token, id, history) {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Once deleted, you will not be able to recover this data!",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       dispatch(supplierActions.Remove(userId, token, id, history));
  //       loadCategories();
  //       swal("Poof! Your Supplier data has been deleted!", {
  //         icon: "success",
  //       });
  //     }
  //   });
  // }

  const deleteCategoryButton = (userId, token, categoryId) => {
    deleteCategory(userId, token, categoryId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadCategories();
      }
    });
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
    <div className="">
      <AdminLayout
        title="Manage Categories"
        description="Perform CRUD on categories"
        className="container-fluid"
      />
      {/* Content Header (Page header) */}
      <div className="">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              {/* <h3 className="title m-3 text-center">Manage Categories</h3> */}
            </div>
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  {/* <h3 className="card-title"></h3> */}
                  <Link
                    to="/admin/dashboard"
                    className="btn btn-outline-warning float-left"
                  >
                    Back
                  </Link>
                  <div className="card-tools">
                    <div className="input-group input-group-sm">
                      <Link to="/supplier/create">
                        <button type="submit" className="btn btn-default">
                          <i className="fas fa-plus" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* {JSON.stringify(supplierReducer)}
                <br />
                <hr /> */}

                {/* {JSON.stringify(categories)} */}

                {/* <h2>Total categories: {supplierReducer.result.length}</h2> */}

                {/* {supplierReducer.result ? (
                  supplierReducer.result.map((c, i) => {
                    return <h2 key={i}>{c.name}</h2>;
                  })
                ) : (
                  <h2>abc</h2>
                )} */}

                {/* <div className="row">
                  <div className="col-12">
                    <ul className="list-group">
                      {supplierReducer.result ? (
                        supplierReducer.result.map((c, i) => {
                          return (
                            <li className="list-group-item" key={c._id}>
                              <strong className="float-left">{c.name}</strong>
                              <div className="float-right">
                                <Link to={`/supplier/update/${c._id}`}>
                                  <span className="badge badge-warning badge-pill m-2">
                                    Update
                                  </span>
                                </Link>

                                <Link to={`/supplier`}>
                                  <span
                                    className="badge badge-danger badge-pill"
                                    onClick={() =>
                                      confirmDelete(
                                        user._id,
                                        token,
                                        c._id,
                                        props.history
                                      )
                                    }
                                  >
                                    Delete
                                  </span>
                                </Link>
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <h2>abc</h2>
                      )} */}

                {/* {supplierReducer.map((c) => (
                        <li className="list-group-item" key={c._id}>
                          <strong className="float-left">{c.name}</strong>
                          <div className="float-right">
                            <Link to={`/supplier/update/${c._id}`}>
                              <span className="badge badge-warning badge-pill m-2">
                                Update
                              </span>
                            </Link>

                            <Link to={`/supplier`}>
                              <span
                                className="badge badge-danger badge-pill"
                                onClick={() =>
                                  confirmDelete(
                                    user._id,
                                    token,
                                    c._id,
                                    props.history
                                  )
                                }
                              >
                                Delete
                              </span>
                            </Link>
                          </div>
                        </li> */}
                {/* </ul>
                  </div>
                </div> */}

                {/* /.card-header */}

                {/* /.card-header */}
                {showError()}

                <h2>Total categories: {categories.length}</h2>
                <div className="card-body table-responsive p-0">
                  <table className="table table-hover text-nowrap">
                    <thead>
                      <tr>
                        <th>Name</th>
                        {/* <th>Vat</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>TEL.</th> */}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories ? (
                        categories.map((c, index) => {
                          return (
                            <tr key={index}>
                              <td>{c.name}</td>
                              {/* <td>{data.vat}</td>
                              <td>{data.address}</td>
                              <td>{data.email}</td>
                              <td>{data.tel}</td> */}
                              <td>
                                <Link to={"/supplier/update/" + c._id}>
                                  Edit
                                </Link>
                                {" | "}
                                <Link
                                  to="/supplier"
                                  onClick={() =>
                                    deleteCategoryButton(
                                      user._id,
                                      token,
                                      c._id
                                      //  props.history
                                    )
                                  }
                                >
                                  Delete
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <td> No data </td>
                      )}
                    </tbody>
                  </table>
                  {showLoading()}
                </div>
                {/* /.card-body */}
              </div>
              {/* /.card */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
