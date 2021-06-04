import Axios from "axios"
// import { PayPalButton } from "react-paypal-button-v2";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { logout } from "../actions/user.action"
import { detailsOrder, payOrder } from "../actions/orderActions"
import LoadingBox from "../components/loading/loading"
import MessageBox from "../components/message/Message"
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET
} from "../constants/orderConstants"

import HeaderTop from "../components/header/header.top"
import HeaderMiddle from "../components/header/header.middle"
import FooterTop from "../components/footer/footer.top"
import FooterMiddle from "../components/footer/footer.middle"
import FooterBottom from "../components/footer/footer.bottom"

import { getBraintreeClientToken, processPayment } from "../utils/api"
import DropIn from "braintree-web-drop-in-react"

export default function OrderScreen({
  history,
  match: {
    params: { id }
  }
}) {
  const orderId = id
  // const [sdkReady, setSdkReady] = useState(false);
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: ""
  })

  const orderDetails = useSelector(state => state.orderDetails)
  const cart = useSelector(state => state.cart.data)
  const islogin = useSelector(state => state.userReducers.user.islogin)
  const { order, loading, error } = orderDetails

  //  const userSignin = useSelector((state) => state.userSignin);
  // const { userInfo } = userSignin;

  console.log(orderDetails)
  // console.log(order._id);

  const orderPay = useSelector(state => state.orderPay)
  const { loading: loadingPay, error: errorPay, success: successPay } = orderPay

  const orderDeliver = useSelector(state => state.orderDeliver)
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver
  } = orderDeliver
  console.log(orderPay)
  // console.log(sdkReady);

  const dispatch = useDispatch()

  const getToken = () => {
    getBraintreeClientToken().then(res => {
      if (!res) {
        setData({ ...data, error: "fail" })
      } else {
        setData({ ...data, clientToken: res.clientToken })
      }
    })
  }

  const onConfirmOrderPaypal = () => {
    setData({ ...data, loading: true })

    let nonce
    data.instance.requestPaymentMethod().then(res => {
      nonce = res.nonce

      const paymentData = {
        paymentMethodNonce: nonce,
        amount: order[0].totalPrice
      }

      processPayment(paymentData)
        .then(response => {
          // console.log(response);
          setData({ ...data, success: response.success })

          const payload = {
            id: response.transaction.id,
            status: "COMPLETED",
            update_time: response.transaction.updatedAt,
            email_address: response.transaction.paypal.payerEmail
          }
          dispatch(payOrder(order, payload))
        })

        .catch(error => {
          console.log("DropIn error: ", error)
          setData({ ...data, error: error.message })
        })
    })
  }

  useEffect(() => {
    // const addPayPalScript = async () => {
    //   const { data } = await Axios.get("/api/config/paypal");
    //   // console.log(data);
    //   const script = document.createElement("script");
    //   script.type = "text/javascript";
    //   script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    //   script.async = true;
    //   script.onload = () => {
    //     setSdkReady(true);
    //   };
    //   document.body.appendChild(script);
    // };

    if (
      !order ||
      successPay ||
      successDeliver ||
      (order && order._id !== orderId)
    ) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(detailsOrder(orderId))
      getToken()
    }
    //  else {
    //   if (!order.isPaid) {
    //     if (!window.paypal) {
    //       // addPayPalScript();
    //     } else {
    //       setSdkReady(true);
    //     }
    //   }
    // }
  }, [dispatch, orderId, successPay, successDeliver])

  // const successPaymentHandler = (paymentResult) => {
  //   dispatch(payOrder(order, paymentResult));
  // };

  // const deliverHandler = () => {
  //   dispatch(deliverOrder(order._id));
  // };

  console.log(data)

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <header id="header">
        <HeaderTop />
        <HeaderMiddle
          islogin={islogin}
          logout={() => dispatch(logout())}
          history={history}
          cart={cart}
        />
      </header>
      <div class="breadcrumbs">
        <ol class="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/purchase_history">Purchase History</Link>
          </li>
          <li className="active">Order</li>
        </ol>
      </div>
      <h1>Order {order[0]._id}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  {order && order.length > 0 ? (
                    <>
                      <strong>Name:</strong> {order[0].user.firstName} <br />
                      <strong>Phone number:</strong>
                      {order[0].user.phone_number} <strong>Address: </strong>
                      {order[0].bills[0].address},{order[0].bills[0].ward},
                      {order[0].bills[0].district},{order[0].bills[0].city},
                      {/* {order[0].bills[0].code} */}
                    </>
                  ) : (
                    <h2>No data</h2>
                  )}
                </p>
                {order[0].isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order[0].deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {order[0].paymentMethod}
                </p>
                {order[0].isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order[0].paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {order ? (
                    order[0].products.map(item => (
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
                    ))
                  ) : (
                    <h2>abc</h2>
                  )}
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
                  <div>${order[0].itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${order[0].shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${order[0].taxPrice.toFixed(2)}</div>
                </div>
              </li> */}
              <li>
                <div className="row">
                  <div>
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>${order[0].totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {!order[0].isPaid ? (
                <li>
                  {errorPay && (
                    <MessageBox variant="danger">{errorPay}</MessageBox>
                  )}
                  {loadingPay && <LoadingBox></LoadingBox>}
                  {data.clientToken && (
                    <>
                      <DropIn
                        options={{
                          authorization: data.clientToken,
                          paypal: {
                            flow: "vault"
                          }
                        }}
                        onInstance={instance => (data.instance = instance)}
                      />
                      <button
                        onClick={onConfirmOrderPaypal}
                        className="btn btn-success btn-block pt-2"
                      >
                        Pay
                      </button>
                    </>
                  )}
                </li>
              ) : (
                <h3>
                  Hóa đơn đã thanh toán. Hàng sẽ đến địa chỉ của quý khách trong
                  thời gian sớm nhất. Cảm ơn quý khách đã mua sách trên trang
                  web của chúng tôi.
                </h3>
              )}
              {/* {!order[0].isPaid && (
                <li>
                  {errorPay && (
                    <MessageBox variant="danger">{errorPay}</MessageBox>
                  )}
                  {loadingPay && <LoadingBox></LoadingBox>}
                  <PayPalButton
                    amount={order[0].totalPrice}
                    onSuccess={successPaymentHandler}
                  ></PayPalButton>
                  {!sdkReady ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}

                      <PayPalButton
                        amount={order[0].totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    </>
                  )}
                </li>
              )} */}
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
