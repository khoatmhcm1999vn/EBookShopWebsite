import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { useSelector, useDispatch } from "react-redux"
// import Message from "../components/message/Message";
import CheckoutSteps from "../components/checkoutsteps/CheckoutSteps"
import { saveShippingAddress } from "../actions/cart.action"
import { getAddress, deleteAddress } from "../actions/user.action"

import { isAuthenticated } from "../config/store.config"
import { logout } from "../actions/user.action"

// import Loader from "../components/loading/loading";
// import SearchBar from "../components/searchbar/SearchBar";

import HeaderTop from "../components/header/header.top"
import HeaderMiddle from "../components/header/header.middle"
import FooterTop from "../components/footer/footer.top"
import FooterMiddle from "../components/footer/footer.middle"
import FooterBottom from "../components/footer/footer.bottom"
import AddressForm from "./AddressForm"

const Address = ({
  adr,
  selectAddress,
  enableAddressEditForm,
  confirmDeliveryAddress,
  onAddressSubmit,
  onDeleteAddress
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
              {/* <div>
                <span className="addressName">{adr.address}</span>
                <span className="addressWard">{adr.ward}</span>
                <span className="addressDistrict">{adr.district}</span>
                <span className="addressCity">{adr.city}</span>
              </div> */}
              {adr.selected && (
                <button
                  className="anchorButton"
                  name="EDIT"
                  onClick={() => enableAddressEditForm(adr)}
                  style={{
                    fontWeight: "500",
                    color: "#2874f0"
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            <div className="fullAddress">
              {adr.address} <br />
              {`${adr.ward} - ${adr.district} - ${adr.city}`}
            </div>
            {adr.selected && (
              <button
                title="DELIVERY HERE"
                className="btn btn-primary"
                onClick={() => confirmDeliveryAddress(adr)}
                style={{
                  width: "200px",
                  margin: "10px 0"
                }}
              >
                Save and Delivery here!
              </button>
            )}
          </div>
        ) : (
          <AddressForm
            withoutLayout={true}
            onSubmitForm={onAddressSubmit}
            initialData={adr}
            deleteAddress={onDeleteAddress}
          />
        )}
      </div>
    </div>
  )
}
const ShippingScreen = ({ history }) => {
  const userAddr = useSelector(state => state.userReducers.user)
  const currentUser = useSelector(state => state.userReducers.user.currentUser)
  const islogin = useSelector(state => state.userReducers.user.islogin)

  const cart = useSelector(state => state.cart.data)

  const [address, setAddress] = useState([])

  // const [newAddress, setNewAddress] = useState(false);
  const [confirmAddress, setConfirmAddress] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)

  const dispatch = useDispatch()

  if (!currentUser) {
    history.push("/login_register")
  }

  const onAddressSubmit = addr => {
    console.log(addr)

    history.push("/payment")

    // setSelectedAddress(addr);
    // setConfirmAddress(true);
    // setOrderSummary(true);
  }

  const selectAddress = addr => {
    console.log(addr)
    const updatedAddress =
      address._id === addr._id
        ? { ...address, selected: true }
        : { ...address, selected: false }

    // const updatedAddress = address.map((adr) =>
    //   adr._id === addr._id
    //     ? { ...adr, selected: true }
    //     : { ...adr, selected: false }
    // );

    setAddress(updatedAddress)
  }

  const confirmDeliveryAddress = addr => {
    console.log(addr)
    setSelectedAddress(addr)
    dispatch(saveShippingAddress(addr._id))
    setConfirmAddress(true)
    history.push("/payment")
  }

  const enableAddressEditForm = addr => {
    console.log(addr)
    const updatedAddress =
      address._id === addr._id
        ? { ...address, edit: true }
        : { ...address, edit: false }

    // const updatedAddress = address.map((adr) =>
    //   adr._id === addr._id ? { ...adr, edit: true } : { ...adr, edit: false }
    // );

    // setNewAddress(true);

    setAddress(updatedAddress)
  }

  useEffect(() => {
    isAuthenticated() && dispatch(getAddress())

    // if (userAddr.address?.length > 0) {
    //   setBillingAddressId(address[0]._id);
    // }
  }, [dispatch])

  useEffect(() => {
    // const address = userAddr.address.address.map((adr) => ({
    //   ...adr,
    //   selected: false,
    //   edit: false,
    // }));

    const address = { ...userAddr.address, selected: false, edit: false }

    setAddress(address)
  }, [userAddr.address])

  // console.log(userAddr.address);
  console.log(address)
  // console.log(newAddress);
  // console.log(confirmAddress);

  // const proceedToPayment = () => {
  // if (billingAddressId === null || billingAddressId === "") {
  //   setMessage("Shipping Address is required");
  //   return;
  // }
  // dispatch(saveShippingAddress(billingAddressId));
  // dispatch(saveBillingAddressIdToLocalStorage(billingAddressId));

  //   history.push("/payment");
  // };

  const onDeleteAddress = addressId => {
    // console.log(addressId);
    // alert("abc");
    // return;

    dispatch(deleteAddress(addressId))
  }

  return (
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
          <li className="active">Shipping</li>
        </ol>
      </div>
      <CheckoutSteps step1 step2 />
      {/* <Row className="mx-3 justify-content-md-center">
        <h1 className="mx-3 justify-content-md-center">Address</h1>
      </Row> */}
      <hr></hr>

      {/* <>
        {confirmAddress ? (
          <>
            <div className="stepCompleted">{`${selectedAddress.address} ${selectedAddress.ward} - ${selectedAddress.district}`}</div>
            <Button
              type="submit"
              variant="primary"
              onClick={proceedToPayment}
              className="mt-3"
              disabled={!confirmAddress}
            >
              Proceed to Payment
            </Button>
          </>
        ) : (
          <h3>abc</h3>
        )}
      </> */}

      {address ? (
        <Address
          selectAddress={selectAddress}
          enableAddressEditForm={enableAddressEditForm}
          confirmDeliveryAddress={confirmDeliveryAddress}
          onAddressSubmit={onAddressSubmit}
          onDeleteAddress={onDeleteAddress}
          adr={address}
        />
      ) : address == null ? (
        <h3>No address</h3>
      ) : null}

      <footer id="footer">
        <FooterTop />
        <FooterMiddle />
        <FooterBottom />
      </footer>
    </div>
  )
}

export default ShippingScreen
