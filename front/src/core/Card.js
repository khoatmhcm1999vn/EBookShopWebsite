import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import Image from "../FormElements/Image";

import { useDispatch, useSelector } from 'react-redux'

import { addToCart } from '../actions/cart.action';

import moment from "moment";
import classes from "./Card.css";
import { addItem, updateItem, removeItem } from "./cartHelpers";

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f, // default value of function
  run = undefined, // default value of undefined
}) => {
  const [redirect, setRedirect] = useState(false);

  const dispatch = useDispatch();
  const productx1 = useSelector(state => state.product);

  const [count, setCount] = useState(product.count);

  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link to={`/${product._id}/p`} className="mr-2">
          <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">
            View Product
          </button>
        </Link>
      )
    );
  };

  // Add to cart functionality
  const addToCart = () => {
    // console.log('added');
    // dispatch(addToCart({ _id, name, price, img }));
    addItem(product, count, () => {
      setRedirect(true);
    });
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCart = (showAddToCartButton) => {
    return (
      showAddToCartButton && (
        <button
          onClick={addToCart}
          className="btn btn-outline-warning mt-2 mb-2 card-btn-1"
        >
          Add to cart
        </button>
      )
    );
  };

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill mb-2">In Stock</span>
    ) : (
      <span className="badge badge-primary badge-pill mb-2">Out of Stock</span>
    );
  };

  // update cart functionality
  const handleChange = (productId) => (event) => {
    setRun(!run); // run useEffect in parent Cart //re-render setItem in localstorage
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <div>
          <div className="input-group-mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input
              type="number"
              className="form-control"
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };

  //Remove item from cart functionality
  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <button
          onClick={() => {
            removeItem(product._id);
            setRun(!run); // run useEffect in parent Cart //re-render setItem in localstorage
          }}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };

  return (
    <div className="card h-100 text-center">
      {/* <div className="card-header name">{product.name}</div> */}
      <div className="card-header">{product.name}</div>
      {/* <h3>{product.imageUrl}</h3> */}
      <div className="card-image">
        {shouldRedirect(redirect)}
        <Image item={product} imageUrl={product.imageUrl} />
      </div>

      <div className="column card-body">
        <p>{product.description.substring(0, 50)}</p>
        <hr />
        <h5>${product.price}</h5>
        <hr />
        <p>
          Category:{" "}
          {product.category &&
            product.category.map((p, i) => {
              return <h2 key={i}>{p.name}</h2>;
            })}
        </p>
        <hr />
        <p>Added {moment(product.createdAt).fromNow()}</p>

        <div>{showStock(product.quantity)}</div>
        <div>
          {showViewButton(showViewProductButton)}

          {/* {showAddToCart(showAddToCartButton)} */}

          {showRemoveButton(showRemoveProductButton)}
        </div>
        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
