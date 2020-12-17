import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";

import { getProducts, deleteProduct } from "./apiAdmin";
import { isAuthenticated } from "../auth";
import UpdateProduct from "./UpdateProduct";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  const { user, token } = isAuthenticated();

  const loadProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  const destroy = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        loadProducts();
      }
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Layout
      title="Manage Products"
      description="Perform CRUD on products"
      className="container-fluid"
    >
      <div className="container w-50">
        <h1 className="title m-3 text-center">Manage Products</h1>
        <Link
          to="/admin/dashboard"
          className="btn btn-outline-warning float-left"
        >
          Back
        </Link>
        <h2>Total products: {products.length}</h2>
        <div className="row">
          <div className="col-12">
            <ul className="list-group">
              {products.map((p) => (
                <li className="list-group-item" key={p._id}>
                  <strong className="float-left">{p.name}</strong>
                  <div className="float-right">
                    <Link
                      to={`/admin/product/update/${p._id}`}
                      categoryId={p.category._id}
                    >
                      <span
                        className="badge badge-warning badge-pill m-2"
                        categoryId={p.category._id}
                      >
                        {/* <UpdateProduct categoryId={p.category._id} /> */}
                        Update
                      </span>
                    </Link>

                    <Link to={`/admin/products`}>
                      <span
                        className="badge badge-danger badge-pill"
                        onClick={() => destroy(p._id)}
                      >
                        Delete
                      </span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="row">
        <div className="col-12">
          <h2 className="text-center">Total {products.length} products</h2>
          <hr />
          <ul className="list-group">
            {products.map((p, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{p.name}</strong>
                <Link to={`/admin/product/update/${p._id}`}>
                  <span className="badge badge-warning badge pill">Update</span>
                </Link>
                <span
                  onClick={() => destroy(p._id)}
                  className="badge badge-danger badge-pill"
                >
                  Delete
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
    </Layout>
  );
};

export default ManageProducts;
