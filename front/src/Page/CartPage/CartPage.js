import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layout/Layout";
import Card from "../../Card/Card";
import CartItem from "./CartItem/CartItem";
import { addToCart, getCartItems, removeCartItem } from "../../actions";
import PriceDetails from "../../PriceDetails/PriceDetails";

import { isAuthenticated } from "../../auth";

import { Link } from "react-router-dom";

import "./CartPage.css";
// import { MaterialButton } from "../../components/MaterialUI";

/**
 * @author
 * @function CartPage
 **/

/*
Before Login
Add product to cart
save in localStorage
when try to checkout ask for credentials and 
if logged in then add products to users cart database from localStorage


*/

const CartPage = (props) => {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  // const cartItems = cart.cartItems;
  const [cartItems, setCartItems] = useState(cart.cartItems);
  const dispatch = useDispatch();

  const { user, token } = isAuthenticated();

  useEffect(() => {
    setCartItems(cart.cartItems);
    console.log(cartItems);
  }, [cart.cartItems]);

  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(getCartItems(user._id, isAuthenticated().token));
    }
  }, [auth.authenticate]);

  const onQuantityIncrement = (_id, qty) => {
    //console.log({_id, qty});
    const { name, price, imageUrl, quantity } = cartItems[_id];
    dispatch(
      addToCart(user._id, token, { _id, name, price, imageUrl, quantity }, 1)
    );
  };

  const onQuantityDecrement = (_id, qty) => {
    const { name, price, imageUrl, quantity } = cartItems[_id];
    dispatch(
      addToCart(user._id, token, { _id, name, price, imageUrl, quantity }, -1)
    );
  };

  const onRemoveCartItem = (userId, token, _id) => {
    dispatch(removeCartItem(userId, token, { product: _id }));
  };

  if (props.onlyCartItems) {
    return (
      <>
        {Object.keys(cartItems).map((key, index) => (
          <CartItem
            key={index}
            cartItem={cartItems[key]}
            onQuantityInc={onQuantityIncrement}
            onQuantityDec={onQuantityDecrement}
          />
        ))}
      </>
    );
  }

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div style={{ width: "250px" }}>
        <button
          title="PLACE ORDER"
          onClick={() => props.history.push(`/checkout`)}
        >
          Place Order
        </button>
      </div>
    ) : (
      <Link to="/login">
        <button className="btn btn-primary">Sign in to buy book!</button>
      </Link>
    );
  };

  return (
    <Layout title="Welcome" description="Buy now" className="container-fluid">
      <div className="cartContainer" style={{ alignItems: "flex-start" }}>
        <Card
          headerLeft={`My Cart`}
          headerRight={<div>Deliver to</div>}
          style={{ width: "calc(100% - 400px)", overflow: "hidden" }}
        >
          {Object.keys(cartItems).map((key, index) => (
            <CartItem
              key={index}
              cartItem={cartItems[key]}
              onQuantityInc={onQuantityIncrement}
              onQuantityDec={onQuantityDecrement}
              onRemoveCartItem={onRemoveCartItem}
            />
          ))}
          {/* <h2>{JSON.stringify(cartItems)}</h2> */}

          <div
            style={{
              width: "100%",
              display: "flex",
              background: "#ffffff",
              justifyContent: "flex-end",
              boxShadow: "0 0 10px 10px #eee",
              padding: "10px 0",
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: "250px" }}>
              <div>{showCheckout()}</div>
              {/* <button
                title="PLACE ORDER"
                onClick={() => props.history.push(`/checkout`)}
              >
                Place Order
              </button> */}
            </div>
          </div>
        </Card>
        <PriceDetails
          totalItem={Object.keys(cart.cartItems).reduce(function (qty, key) {
            return qty + cart.cartItems[key].qty;
          }, 0)}
          totalPrice={Object.keys(cart.cartItems).reduce((totalPrice, key) => {
            const { price, qty } = cart.cartItems[key];
            return totalPrice + price * qty;
          }, 0)}
        />
      </div>
    </Layout>
  );
};

export default CartPage;
