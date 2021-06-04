import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { createOrder } from "../actions/orderActions"
import { logout } from "../actions/user.action"
import CheckoutSteps from "../components/checkoutsteps/CheckoutSteps"
import { ORDER_CREATE_RESET } from "../constants/orderConstants"
import LoadingBox from "../components/loading/loading"
import MessageBox from "../components/message/Message"
import HeaderTop from "../components/header/header.top"
import HeaderMiddle from "../components/header/header.middle"
import FooterTop from "../components/footer/footer.top"
import FooterMiddle from "../components/footer/footer.middle"
import FooterBottom from "../components/footer/footer.bottom"

import {
  getMyAddresesAction,
  saveAddressAction,
  deleteAddressAction
} from "../actions/address.action"
import { getCart } from "../actions/cart.action"

export default function PlaceOrderScreen(props) {
  const cart = useSelector(state => state.cart)
  const islogin = useSelector(state => state.userReducers.user.islogin)

  if (!cart.paymentMethod) {
    props.history.push("/payment")
  }

  const orderCreate = useSelector(state => state.orderCreate)
  const { loading, success, error, order } = orderCreate

  const toPrice = num => Number(num.toFixed(2)) // 5.123 => "5.12" => 5.12
  cart.totalPrice = toPrice(
    cart.data.reduce((a, c) => a + c.count * c.price, 0)
  )
  // cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
  // cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
  // cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const dispatch = useDispatch()
  const placeOrderHandler = () => {
    dispatch(createOrder({ ...cart, products: cart.data }))
  }

  // const addressList = useSelector((state) => state.addressListMy);
  const userAddr = useSelector(state => state.userReducers.user)
  // const {
  //   addresses,
  //   loading: addressListLoading,
  //   error: addressListError,
  // } = addressList;
  // const { address } = addresses;
  // console.log(address[0]);
  // console.log(addresses);
  // console.log(cart.paymentMethod);
  console.log(userAddr.address)

  // useEffect(() => {
  //   // dispatch(getMyAddresesAction());
  //   // dispatch(getCart());
  // }, [dispatch]);

  // const getShippingAddress = async () => {
  //   dispatch(getMyAddresesAction());
  // };
  // const getMyCart = () => {
  //   dispatch(getCart());
  // };

  useEffect(() => {
    if (success) {
      props.history.push(`/order/${order._id}`)
      dispatch({ type: ORDER_CREATE_RESET })
      // alert("success");
      // return;
    }
  }, [dispatch, order, props.history, success])

  console.log(cart)
  return (
    <div>
      <header id="header">
        <HeaderTop />
        <HeaderMiddle
          islogin={islogin}
          logout={() => dispatch(logout())}
          history={props.history}
          cart={cart.data}
        />
      </header>
      <div class="breadcrumbs">
        <ol class="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="active">Place Order</li>
        </ol>
      </div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      {/* <h3>{JSON.stringify(cart.totalPrice)}</h3> */}
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong> {userAddr.address.user.firstName}
                  <br />
                  <strong>Phone number:</strong>
                  {userAddr.address.user.phone_number}
                  <br />
                  <strong>Address: </strong>
                  {userAddr.address.address},{userAddr.address.ward},
                  {userAddr.address.district},{userAddr.address.city},
                  {userAddr.address.code}
                  {/* {userAddr.address.address &&
                  userAddr.address.address.length > 0 ? (
                    <>
                      <strong>Address: </strong>
                      {userAddr.address.address[0].address},
                      {userAddr.address.address[0].ward},
                      {userAddr.address.address[0].district},
                      {userAddr.address.address[0].city},
                      {userAddr.address.address[0].code}
                    </>
                  ) : (
                    <h2>No data</h2>
                  )} */}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {cart.paymentMethod}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {cart.data.map(item => (
                    <li key={item._id}>
                      <div className="row">
                        <div>
                          <img
                            src={item.img}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </div>

                        <div>
                          {item.count} x ${item.price} = $
                          {item.count * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              {/* <li>
                <div className="row">
                  <div>Items</div>
                  <div>${cart.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${cart.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${cart.taxPrice.toFixed(2)}</div>
                </div>
              </li> */}
              <li>
                <div className="row">
                  <div>
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>${cart.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              <li>
                <button
                  type="button"
                  onClick={placeOrderHandler}
                  className="primary block"
                  disabled={cart.data.length === 0}
                >
                  Place Order
                </button>
              </li>
              {loading && <LoadingBox></LoadingBox>}
              {error && <MessageBox variant="danger">{error}</MessageBox>}
            </ul>
          </div>
        </div>
      </div>
      <footer id="footer">
        <FooterTop />
        <FooterMiddle />
        <FooterBottom />
      </footer>
    </div>
  )
}
