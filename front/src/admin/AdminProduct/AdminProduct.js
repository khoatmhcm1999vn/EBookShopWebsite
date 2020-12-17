import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import { Container, Row, Col, Table } from "react-bootstrap";
// import Input from "../../components/UI/Input";
// import Modal from "../../components/UI/Modal";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../actions/index";
import * as supplierActions from "../../actions";
// import { generatePublicUrl } from "../../urlConfig";
import "./AdminProduct.css";

import Card from "../../Card/Card";

import { Link } from "react-router-dom";

import { isAuthenticated } from "../../auth";

import Image from "../../FormElements/Image";

/**
 * @author
 * @function Products
 **/

const AdminProduct = (props) => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product);
  // const auth = useSelector((state) => state.auth);
  // const { page } = product;

  // const { user } = auth;
  // const { role } = user;

  // const {
  //   user: { role },
  // } = isAuthenticated();

  useEffect(() => {
    // const params = getParams(props.location.search);
    // console.log({params});
    // const payload = {
    //     params
    // }
    dispatch(getProducts());
  }, []);

  return (
    <Layout
      title="Product Home Shop"
      description={`Dashboard of , you can buy all the products here`}
    >
      <div>
        {/* {JSON.stringify(product.products)} */}
        {/* <h2>{JSON.stringify(role)}</h2> */}
        {product.products &&
          product.products.map((product, index) => (
            <Card
              key={index}
              style={{
                width: "400px",
                height: "200px",
                margin: "5px",
              }}
            >
              <Link to={`/${product._id}/p`}>View Detail</Link>
              <h3>{product.name}</h3>
              <div className="card-image">
                <Image item={product} imageUrl={product.imageUrl} />
              </div>
              <br />

              <hr />

              <p>
                Category:{" "}
                {product.category &&
                  product.category.map((p, i) => {
                    return <h2 key={i}>{p.name}</h2>;
                  })}
              </p>
            </Card>
          ))}
      </div>
    </Layout>
  );
};

export default AdminProduct;
