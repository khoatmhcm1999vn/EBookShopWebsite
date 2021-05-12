import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/user.action";
import { savePaymentMethod } from "../actions/cart.action";
import CheckoutSteps from "../components/checkoutsteps/CheckoutSteps";
import HeaderTop from "../components/header/header.top";
import HeaderMiddle from "../components/header/header.middle";
import FooterTop from "../components/footer/footer.top";
import FooterMiddle from "../components/footer/footer.middle";
import FooterBottom from "../components/footer/footer.bottom";

export default function PaymentScreen({ history }) {
  const cart = useSelector((state) => state.cart);
  const islogin = useSelector((state) => state.userReducers.user.islogin);
  const { shippingAddress } = cart;
  if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
    history.push("/shipping");
  }
  // console.log(cart);
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };
  return (
    <div>
      <header id="header">
        <HeaderTop />
        <HeaderMiddle
          islogin={islogin}
          logout={() => dispatch(logout())}
          history={history}
          cart={cart.data}
        />
      </header>
      <div class="breadcrumbs">
        <ol class="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="active">Payment</li>
        </ol>
      </div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Payment Method</h1>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="paypal"
              value="PayPal"
              name="paymentMethod"
              required
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="paypal">PayPal</label>
          </div>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="braintree"
              value="Braintree"
              name="paymentMethod"
              required
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="braintree">Braintree</label>
          </div>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Continue
          </button>
        </div>
      </form>
      <footer id="footer">
        <FooterTop />
        <FooterMiddle />
        <FooterBottom />
      </footer>
    </div>
  );
}
