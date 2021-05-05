import React from "react";
import { Link } from "react-router-dom";

const ProductItem = ({ urlImg, price, describe, id, book, addToCart }) => (
  <div className="col-sm-4">
    <div className="product-image-wrapper">
      <div className="single-products">
        <div className="productinfo text-center">
          <Link to={"/product/" + id}>
            <img src={urlImg} alt="" />
          </Link>
          {/* <Link to={"/product/" + id}>
            <h2>{book.name}</h2>
          </Link> */}
          <Link to={"/product/" + id}>
            <h2>{price}</h2>
          </Link>
          <p
            onClick={() => {
              book.count = 1;
              addToCart(book);
            }}
          >
            <a className="add-to-cart">
              <i className="fa fa-shopping-cart"></i>Add to cart
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
);
export default ProductItem;
