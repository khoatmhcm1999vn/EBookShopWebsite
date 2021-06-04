import React from "react"
import { Link } from "react-router-dom"

const ProductItem = ({ urlImg, price, describe, id, book, addToCart }) => (
  <div className="col-sm-4">
    <div className="product-image-wrapper">
      <div className="single-products">
        <div className="productinfo text-center">
          <Link to={"/product/" + id}>
            <img
              src={urlImg}
              style={{ width: "70%", maxHeight: "80px", minHeight: "70px" }}
              alt=""
            />
          </Link>
          <Link to={"/product/" + id}>
            <h2 style={{ fontSize: "1.35rem" }}>{book.name}</h2>
          </Link>
          <Link to={"/product/" + id}>
            <h2 style={{ fontSize: "1.2rem" }}>${price}</h2>
          </Link>
          <p
            onClick={() => {
              book.count = 1
              addToCart(book)
            }}
          >
            <button
              className="add-to-cart"
              style={{ fontSize: "1.6rem", marginTop: "-80px" }}
            >
              <i className="fa fa-shopping-cart"></i>Add to cart
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
)
export default ProductItem
