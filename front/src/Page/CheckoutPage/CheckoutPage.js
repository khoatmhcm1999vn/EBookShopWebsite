import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, getAddress, getCartItems } from "../../actions";

import Layout from "../../Layout/Layout";

// import {
//   Anchor,
//   MaterialButton,
//   MaterialInput,
// } from "../../components/MaterialUI";

import PriceDetails from "../../PriceDetails/PriceDetails";
import Card from "../../Card/Card";
import CartPage from "../CartPage/CartPage";
import AddressForm from "./AddressForm";

import { Link } from "react-router-dom";

import "./CheckoutPage.css";

import {
  getBraintreeClientToken,
  processPayment,
  createOrder,
} from "../../core/apiCore";

// import { emptyCart } from "./cartHelpers";

import { isAuthenticated } from "../../auth";

import DropIn from "braintree-web-drop-in-react"; // https://www.npmjs.com/package/braintree-web-drop-in-react

/**
 * @author
 * @function CheckoutPage
 **/

const CheckoutStep = (props) => {
  return (
    <div className="checkoutStep">
      <div
        onClick={props.onClick}
        className={`checkoutHeader ${props.active && "active"}`}
      >
        <div>
          <span className="stepNumber">{props.stepNumber}</span>
          <span className="stepTitle">{props.title}</span>
        </div>
      </div>
      {props.body && props.body}
    </div>
  );
};

const Address = ({
  adr,
  selectAddress,
  enableAddressEditForm,
  confirmDeliveryAddress,
  onAddressSubmit,
}) => {
  return (
    <div className="flexRow addressContainer">
      <div>
        <input name="address" onClick={() => selectAddress(adr)} type="radio" />
      </div>
      <div className="flexRow sb addressinfo">
        {!adr.edit ? (
          <div style={{ width: "100%" }}>
            <div className="addressDetail">
              <div>
                <span className="addressName">{adr.name}</span>
                <span className="addressType">{adr.addressType}</span>
                <span className="addressMobileNumber">{adr.mobileNumber}</span>
              </div>
              {adr.selected && (
                <button
                  className="anchorButton"
                  name="EDIT"
                  onClick={() => enableAddressEditForm(adr)}
                  style={{
                    fontWeight: "500",
                    color: "#2874f0",
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            <div className="fullAddress">
              {adr.address} <br /> {`${adr.state} - ${adr.pinCode}`}
            </div>
            {adr.selected && (
              <button
                title="DELIVERY HERE"
                onClick={() => confirmDeliveryAddress(adr)}
                style={{
                  width: "200px",
                  margin: "10px 0",
                }}
              >
                Save delivery
              </button>
            )}
          </div>
        ) : (
          <AddressForm
            withoutLayout={true}
            onSubmitForm={onAddressSubmit}
            initialData={adr}
            onCancel={() => {}}
          />
        )}
      </div>
    </div>
  );
};

const CheckoutPage = (props) => {
  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);
  const [newAddress, setNewAddress] = useState(false);
  const [address, setAddress] = useState([]);
  const [confirmAddress, setConfirmAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderSummary, setOrderSummary] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(false);
  const [paymentOption, setPaymentOption] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState(false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // const [cartItems, setCartItems] = useState(cart.cartItems);

  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  // const getItems = () => {
  //   Object.keys(cartItems).map((key, index) => {
  //     console.log(cartItems[key]);
  //     return cartItems[key];
  //   });
  // };

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;
  // const role = isAuthenticated() && isAuthenticated().user.role;

  const onAddressSubmit = (addr) => {
    setSelectedAddress(addr);
    setConfirmAddress(true);
    setOrderSummary(true);
  };

  const selectAddress = (addr) => {
    //console.log(addr);
    const updatedAddress = address.map((adr) =>
      adr._id === addr._id
        ? { ...adr, selected: true }
        : { ...adr, selected: false }
    );
    setAddress(updatedAddress);
  };

  const confirmDeliveryAddress = (addr) => {
    setSelectedAddress(addr);
    setConfirmAddress(true);
    setOrderSummary(true);
  };

  const enableAddressEditForm = (addr) => {
    const updatedAddress = address.map((adr) =>
      adr._id === addr._id ? { ...adr, edit: true } : { ...adr, edit: false }
    );
    setAddress(updatedAddress);
  };

  const userOrderConfirmation = () => {
    setOrderConfirmation(true);
    setOrderSummary(false);
    setPaymentOption(true);
  };

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (!data) {
        // console.log(data.error);
        setData({ ...data, error: "fail" });
      } else {
        console.log(data);
        setData({ clientToken: data.clientToken });
      }
    });
  };

  const onConfirmOrder = () => {
    const totalAmount = Object.keys(cart.cartItems).reduce(
      (totalPrice, key) => {
        const { price, qty } = cart.cartItems[key];
        return totalPrice + price * qty;
      },
      0
    );

    const items = Object.keys(cart.cartItems).map((key) => ({
      product: key,
      // transaction_id: response.transaction.id,
      payablePrice: cart.cartItems[key].price,
      purchasedQty: cart.cartItems[key].qty,
      sold: cart.cartItems[key].sold,
      quantity: cart.cartItems[key].quantity,
      name: cart.cartItems[key].name,
      description: cart.cartItems[key].description,
    }));
    const payload = {
      addressId: selectedAddress._id,
      // totalAmount: response.transaction.amount,
      totalAmount,
      items,
      paymentStatus: "pending",
      paymentType: "cod",
    };

    console.log(payload);
    dispatch(addOrder(userId, token, payload));
    setConfirmOrder(true);
  };

  const onConfirmOrderPaypal = () => {
    const totalAmount = Object.keys(cart.cartItems).reduce(
      (totalPrice, key) => {
        const { price, qty } = cart.cartItems[key];
        return totalPrice + price * qty;
      },
      0
    );

    setData({ loading: true });
    let nonce;

    let getNonce = data.instance.requestPaymentMethod().then((data) => {
      console.log(data);
      nonce = data.nonce;
      // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
      // and also total to be charged
      // console.log(
      //   "Send nonce and total to process: ",
      //   nonce,
      //   getTotal(products)
      // );

      const paymentData = {
        paymentMethodNonce: nonce,
        amount: totalAmount,
      };

      processPayment(userId, token, paymentData)
        .then((response) => {
          console.log(response);

          setData({ ...data, success: response.success });
          // empty cart
          // create order

          // const createOrderData = {
          //   products: products,
          //   transaction_id: response.transaction.id,
          //   amount: response.transaction.amount,
          //   address: deliveryAddress,
          //   // address: data.address
          // };

          const items = Object.keys(cart.cartItems).map((key) => ({
            product: key,
            transaction_id: response.transaction.id,
            payablePrice: cart.cartItems[key].price,
            purchasedQty: cart.cartItems[key].qty,
            sold: cart.cartItems[key].sold,
            quantity: cart.cartItems[key].quantity,
            name: cart.cartItems[key].name,
            description: cart.cartItems[key].description,
          }));
          const payload = {
            addressId: selectedAddress._id,
            totalAmount: response.transaction.amount,
            // totalAmount,
            items,
            paymentStatus: "pending",
            paymentType: "card",
          };

          console.log(payload);
          dispatch(addOrder(userId, token, payload));
          setConfirmOrder(true);

          //   createOrder(userId, token, createOrderData)
          //     .then((response) => {
          //       emptyCart(() => {
          //         setRun(!run); // run useEffect in parent Cart // re-render localstorage
          //         console.log("Payment success and Empty Cart");
          //         setData({ loading: false, success: true });
          //       });
          //     })
          //     .catch((error) => {
          //       console.log(error);
          //       setData({ loading: false });
          //     });
          // });
        })
        .catch((error) => {
          console.log("DropIn error: ", error);
          setData({ ...data, error: error.message });
        });
    });
  };

  useEffect(() => {
    isAuthenticated() && dispatch(getAddress(userId, token));
    isAuthenticated() && dispatch(getCartItems(userId, token));
    // auth.authenticate
    getToken(userId, token);
  }, [auth.authenticate]);

  // useEffect(() => {
  //   // const address
  //   const items = Object.keys(cart.cartItems).map((key) => ({
  //     product: key,
  //     payablePrice: cart.cartItems[key].price,
  //     purchasedQty: cart.cartItems[key].qty,
  //     sold: cart.cartItems[key].sold,
  //     quantity: cart.cartItems[key].quantity,
  //     name: cart.cartItems[key].name,
  //     description: cart.cartItems[key].description,
  //   }));
  //   setCartItems(items);
  //   console.log(cartItems);
  // }, [cart.cartItems]);

  useEffect(() => {
    const address = user.address.map((adr) => ({
      ...adr,
      selected: false,
      edit: false,
    }));
    setAddress(address);
    //user.address.length === 0 && setNewAddress(true);
  }, [user.address]);

  if (confirmOrder) {
    return (
      <Layout
        title="Thank you"
        description="Thank you"
        className="container-fluid"
      >
        <Card>
          <div>Thank you</div>
        </Card>
      </Layout>
    );
  }

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="/login">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })} className="w-50 m-auto">
      <div>
        <div className="form-group mb-3">
          <label className="text-muted">
            Delivery address:{" "}
            <h3>
              {user.address.map((u, i) => {
                return <h3 key={i}>{u.address}</h3>;
              })}
            </h3>
          </label>
          {/* <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your delivery address here..."
            /> */}
        </div>

        <DropIn
          options={{
            authorization: data.clientToken,
            paypal: {
              flow: "vault",
            },
          }}
          onInstance={(instance) => (data.instance = instance)}
        />
        <button
          onClick={onConfirmOrderPaypal}
          className="btn btn-success btn-block pt-2"
        >
          Pay
        </button>
      </div>
    </div>
  );

  // let deliveryAddress = adr.name;

  // const buy = () => {
  //   // send the nonce to your server
  //   // nonce = data.instance.requestPaymentMethod()
  //   setData({ loading: true });
  //   let nonce;
  //   let getNonce = data.instance
  //     .requestPaymentMethod()
  //     .then((data) => {
  //       console.log(data);
  //       nonce = data.nonce;
  //       // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
  //       // and also total to be charged
  //       // console.log(
  //       //   "Send nonce and total to process: ",
  //       //   nonce,
  //       //   getTotal(products)
  //       // );

  //       const paymentData = {
  //         paymentMethodNonce: nonce,
  //         totalAmount: 5,
  //       };

  //       processPayment(userId, token, paymentData).then((response) => {
  //         console.log(response);

  //         setData({ ...data, success: response.success });
  //         // empty cart
  //         // create order

  //         const createOrderData = {
  //           // products: products,
  //           transaction_id: response.transaction.id,
  //           totalAmount: response.transaction.amount,
  //           // address: deliveryAddress,
  //           // address: data.address
  //         };

  //         createOrder(userId, token, createOrderData)
  //           .then((response) => {
  //             // emptyCart(() => {
  //             //   setRun(!run); // run useEffect in parent Cart // re-render localstorage
  //             //   console.log("Payment success and Empty Cart");
  //             //   setData({ loading: false, success: true });
  //             // });
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //             setData({ loading: false });
  //           });
  //       });
  //     })
  //     .catch((error) => {
  //       console.log("DropIn error: ", error);
  //       setData({ ...data, error: error.message });
  //     });
  // };

  return (
    <Layout>
      <div className="cartContainer" style={{ alignItems: "flex-start" }}>
        <div className="checkoutContainer">
          {/* check if user logged in or not */}
          <CheckoutStep
            stepNumber={"1"}
            title={"LOGIN"}
            active={!isAuthenticated()}
            body={
              isAuthenticated() ? (
                <div className="loggedInId">
                  <span style={{ fontWeight: 500 }}>
                    {isAuthenticated().user.name}
                  </span>
                  <span style={{ margin: "0 5px" }}>
                    {isAuthenticated().user.email}
                  </span>
                </div>
              ) : (
                <div>
                  <input label="Email" />
                </div>
              )
            }
          />
          <CheckoutStep
            stepNumber={"2"}
            title={"DELIVERY ADDRESS"}
            active={!confirmAddress && isAuthenticated()}
            body={
              <>
                {confirmAddress ? (
                  <div className="stepCompleted">{`${selectedAddress.name} ${selectedAddress.address} - ${selectedAddress.pinCode}`}</div>
                ) : (
                  address.map((adr) => (
                    <Address
                      selectAddress={selectAddress}
                      enableAddressEditForm={enableAddressEditForm}
                      confirmDeliveryAddress={confirmDeliveryAddress}
                      onAddressSubmit={onAddressSubmit}
                      adr={adr}
                    />
                  ))
                )}
              </>
            }
          />

          {/* AddressForm */}
          {confirmAddress ? null : newAddress ? (
            <AddressForm onSubmitForm={onAddressSubmit} onCancel={() => {}} />
          ) : isAuthenticated() ? (
            <CheckoutStep
              stepNumber={"+"}
              title={"ADD NEW ADDRESS"}
              active={false}
              onClick={() => setNewAddress(true)}
            />
          ) : null}

          <CheckoutStep
            stepNumber={"3"}
            title={"ORDER SUMMARY"}
            active={orderSummary}
            body={
              orderSummary ? (
                <CartPage onlyCartItems={true} />
              ) : orderConfirmation ? (
                <div className="stepCompleted">
                  {Object.keys(cart.cartItems).length} items
                </div>
              ) : null
            }
          />

          {orderSummary && (
            <Card
              style={{
                margin: "10px 0",
              }}
            >
              <div
                className="flexRow sb"
                style={{
                  padding: "20px",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "12px" }}>
                  Order confirmation email will be sent to{" "}
                  <strong>{isAuthenticated().user.email}</strong>
                </p>
                <button
                  title="CONTINUE"
                  onClick={userOrderConfirmation}
                  style={{
                    width: "200px",
                  }}
                >
                  Continue
                </button>
              </div>
            </Card>
          )}

          <CheckoutStep
            stepNumber={"4"}
            title={"PAYMENT OPTIONS"}
            active={paymentOption}
            body={
              paymentOption && (
                <div>
                  <div
                    className="flexRow"
                    style={{
                      alignItems: "center",
                      padding: "20px",
                    }}
                  >
                    <input type="radio" name="paymentOption" value="cod" />
                    <h2>Payment by Cash</h2>
                    <div>Cash on delivery</div>
                    {/* {Object.keys(cartItems).map((key, index) => {
                      return <h2>{cartItems[key]}</h2>;
                    })} */}

                    {/* <h2>{JSON.stringify(cartItems)}</h2> */}
                    <button
                      title="CONFIRM ORDER"
                      onClick={onConfirmOrder}
                      style={{
                        width: "200px",
                        margin: "0 0 20px 20px",
                      }}
                    >
                      Confirm Order
                    </button>
                    <hr />
                    <h2>OR Pay by card</h2>

                    {/* <div>{showCheckout()}</div> */}
                  </div>
                </div>
              )
            }
          />
        </div>

        {/* Price Component */}
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

export default CheckoutPage;
