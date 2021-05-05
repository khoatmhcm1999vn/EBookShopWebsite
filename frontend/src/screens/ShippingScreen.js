import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
// import Message from "../components/message/Message";
import CheckoutSteps from "../components/checkoutsteps/CheckoutSteps";
import { saveShippingAddress } from "../actions/cart.action";
import { getAddress, addAddress, deleteAddress } from "../actions/user.action";
import { isAuthenticated } from "../config/store.config";
import { logout } from "../actions/user.action";
// import Loader from "../components/loading/loading";
// import SearchBar from "../components/searchbar/SearchBar";
import HeaderTop from "../components/header/header.top";
import HeaderMiddle from "../components/header/header.middle";
import FooterTop from "../components/footer/footer.top";
import FooterMiddle from "../components/footer/footer.middle";
import FooterBottom from "../components/footer/footer.bottom";
import AddressForm from "./AddressForm";

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
  onDeleteAddress,
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
                    color: "#2874f0",
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
                  margin: "10px 0",
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
            onCancel={() => {}}
            deleteAddress={onDeleteAddress}
          />
        )}
      </div>
    </div>
  );
};
const ShippingScreen = ({ history }) => {
  const userAddr = useSelector((state) => state.userReducers.user);
  const currentUser = useSelector(
    (state) => state.userReducers.user.currentUser
  );
  const islogin = useSelector((state) => state.userReducers.user.islogin);

  // const [shippingCheckbox, setShippingCheckbox] = useState(true);
  const [addressLine1, setAddressLine1] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  // const [message, setMessage] = useState("");
  // const [billingAddressId, setBillingAddressId] = useState("");
  // const [shippingAddressId, setShippingAddressId] = useState("");

  const [newAddress, setNewAddress] = useState(false);
  const [address, setAddress] = useState([]);
  const [confirmAddress, setConfirmAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  // const [orderSummary, setOrderSummary] = useState(false);
  // const [orderConfirmation, setOrderConfirmation] = useState(false);
  // const [paymentOption, setPaymentOption] = useState(false);
  // const [confirmOrder, setConfirmOrder] = useState(false);
  const dispatch = useDispatch();

  // const {
  //   user: { _id },
  // } = currentUser;
  // console.log(_id);
  // console.log(billingAddressId);
  // console.log(islogin);

  // const addressList = useSelector((state) => state.addressListMy);
  // const {
  //   addresses,
  //   loading: addressListLoading,
  //   error: addressListError,
  // } = addressList;
  // const addressSave = useSelector((state) => state.addressSave);
  // const {
  //   success,
  //   loading: addressSaveLoading,
  //   error: addressSaveError,
  // } = addressSave;
  // const { address } = addresses;
  // console.log(addresses);
  // console.log(addressListLoading);

  if (!currentUser) {
    history.push("/login_register");
  }

  const onAddressSubmit = (addr) => {
    // console.log(addr);
    setSelectedAddress(addr);
    setConfirmAddress(true);
    // setOrderSummary(true);
  };
  const selectAddress = (addr) => {
    // console.log(addr);
    const updatedAddress = address.map((adr) =>
      adr._id === addr._id
        ? { ...adr, selected: true }
        : { ...adr, selected: false }
    );
    setAddress(updatedAddress);
  };
  const confirmDeliveryAddress = (addr) => {
    setSelectedAddress(addr);
    dispatch(saveShippingAddress(addr._id));
    setConfirmAddress(true);
    // setOrderSummary(true);
    history.push("/payment");
  };
  const enableAddressEditForm = (addr) => {
    const updatedAddress = address.map((adr) =>
      adr._id === addr._id ? { ...adr, edit: true } : { ...adr, edit: false }
    );
    setAddress(updatedAddress);
  };

  // const userOrderConfirmation = () => {
  //   setOrderConfirmation(true);
  //   setOrderSummary(false);
  //   setPaymentOption(true);
  // };

  useEffect(() => {
    isAuthenticated() && dispatch(getAddress());
    // if (userAddr.address?.length > 0) {
    //   setBillingAddressId(address[0]._id);
    // }
  }, [dispatch, islogin]);
  useEffect(() => {
    const address = userAddr.address.address.map((adr) => ({
      ...adr,
      selected: false,
      edit: false,
    }));
    setAddress(address);
    //user.address.length === 0 && setNewAddress(true);
  }, [userAddr.address.address]);
  // console.log(userAddr.address);
  console.log(address);
  // console.log(userAddr);

  // const getShippingAddress = async () => {
  //   dispatch(getMyAddresesAction());
  // };
  // const saveAddressHandler = async (e) => {
  //   e.preventDefault();
  //   const addressRequestBody = {
  //     payload: {
  //       address: {
  //         address: addressLine1,
  //         ward,
  //         district,
  //         city,
  //         code: postalCode,
  //       },
  //     },
  //   };
  //   setAddressLine1("");
  //   setWard("");
  //   setDistrict("");
  //   setCity("");
  //   setPostalCode("");
  //   // console.log(addressRequestBody);
  //   dispatch(addAddress(addressRequestBody));
  // };
  const proceedToPayment = () => {
    // if (billingAddressId === null || billingAddressId === "") {
    //   setMessage("Shipping Address is required");
    //   return;
    // }
    // dispatch(saveShippingAddress(billingAddressId));
    // dispatch(saveBillingAddressIdToLocalStorage(billingAddressId));
    history.push("/payment");
  };
  const onDeleteAddress = (addressId) => {
    // console.log(addressId);
    // alert("abc");
    // return;
    dispatch(deleteAddress(addressId));
  };

  return (
    <div>
      <header id="header">
        <HeaderTop />
        <HeaderMiddle
          islogin={islogin}
          logout={() => dispatch(logout())}
          history={history}
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
      {/* <CheckoutStep
        stepNumber={"1"}
        title={"LOGIN"}
        active={!islogin}
        body={
          islogin ? (
            <div className="loggedInId">
              <span style={{ fontWeight: 500 }}>
                {currentUser.user.firstName}
              </span>
              <span style={{ margin: "0 5px" }}>{currentUser.user.email}</span>
            </div>
          ) : (
            <div>
              <input label="Email" />
            </div>
          )
        }
      /> */}
      <>
        {confirmAddress ? (
          <>
            <div className="stepCompleted">{`${selectedAddress.address} ${selectedAddress.ward} - ${selectedAddress.code}`}</div>
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
          address.map((adr) => (
            <Address
              selectAddress={selectAddress}
              enableAddressEditForm={enableAddressEditForm}
              confirmDeliveryAddress={confirmDeliveryAddress}
              onAddressSubmit={onAddressSubmit}
              onDeleteAddress={onDeleteAddress}
              adr={adr}
            />
          ))
        )}
      </>
      {/* AddressForm */}
      {confirmAddress ? null : newAddress ? (
        <AddressForm onSubmitForm={onAddressSubmit} onCancel={() => {}} />
      ) : islogin ? (
        <CheckoutStep
          stepNumber={"+"}
          title={"ADD NEW ADDRESS"}
          active={false}
          onClick={() => setNewAddress(true)}
        />
      ) : null}
      {/* <Row className="mx-5 justify-content-md-center">
        <Button
          type="submit"
          variant="primary"
          onClick={proceedToPayment}
          className="mt-3"
          disabled={!confirmAddress}
        >
          Proceed to Payment
        </Button>
      </Row> */}
      <footer id="footer">
        <FooterTop />
        <FooterMiddle />
        <FooterBottom />
      </footer>
    </div>
  );
};

export default ShippingScreen;
