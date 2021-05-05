import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../actions/user.action";
import { saveShippingAddress } from "../actions/cart.action";
// import { MaterialButton, MaterialInput } from "../../components/MaterialUI";
import SearchBar from "../components/searchbar/SearchBar";
/**
 * @author
 * @function AddressForm
 **/
const AddressForm = (props) => {
  const { initialData } = props;
  // const [pinCode, setPinCode] = useState(
  //   initialData ? initialData.pinCode : ""
  // );
  const [address, setAddress] = useState(
    initialData ? initialData.address : ""
  );
  const [ward, setWard] = useState(initialData ? initialData.ward : "");
  const [district, setDistrict] = useState(
    initialData ? initialData.district : ""
  );
  const [city, setCity] = useState(initialData ? initialData.city : "");
  const [code, setCode] = useState(initialData ? initialData.code : "");

  const dispatch = useDispatch();
  const userAddr = useSelector((state) => state.userReducers.user);
  const [submitFlag, setSubmitFlag] = useState(false);
  const [id, setId] = useState(initialData ? initialData._id : "");

  // console.log(id);

  const inputContainer = {
    width: "100%",
    marginRight: 10,
  };
  const onAddressSubmit = (e) => {
    const payload = {
      address: {
        address,
        ward,
        district,
        city,
        code,
      },
    };
    // console.log(payload);
    if (id) {
      payload.address._id = id;
      dispatch(saveShippingAddress(payload.address._id));
    }
    dispatch(addAddress(payload));
    setSubmitFlag(true);
  };

  useEffect(() => {
    console.log("addressCount", userAddr.address);
    if (submitFlag) {
      console.log("where are we", userAddr);
      let _address = {};
      if (id) {
        _address = {
          _id: id,
          address,
          ward,
          district,
          city,
          code,
        };
      } else {
        _address = userAddr.address.slice(userAddr.address.length - 1)[0];
      }
      // console.log(_address);
      props.onSubmitForm(_address);
    }
  }, [userAddr.address]);

  const renderAddressForm = () => {
    return (
      <>
        {/* <SearchBar
          setAddressLine1={setAddress}
          setWard={setWard}
          setDistrict={setDistrict}
          setCity={setCity}
        /> */}
        <div className="flexRow">
          <div style={inputContainer}>
            <label
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              Address: &nbsp;
            </label>
            <input
              placeholder="Enter Address"
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="flexRow">
          <div style={inputContainer}>
            <label
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              Ward: &nbsp;
            </label>
            <input
              placeholder="Enter Ward"
              label="Ward"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            />
          </div>
        </div>
        <div className="flexRow">
          <div style={inputContainer}>
            <label
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              District: &nbsp;
            </label>
            <input
              placeholder="Enter District"
              label="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
        </div>
        <div className="flexRow">
          <div style={inputContainer}>
            <label
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              City: &nbsp;
            </label>
            <input
              placeholder="Enter City"
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <div className="flexRow">
          <div style={inputContainer}>
            <label
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              Locality: &nbsp;
            </label>
            <input
              placeholder="Enter Locality"
              label="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
        <div className="flexRow">
          <button
            title="SAVE AND DELIVER HERE"
            className="btn btn-primary"
            onClick={onAddressSubmit}
            style={{
              width: "250px",
              margin: "20px 0",
            }}
          >
            Save and Delivery here!
          </button>
        </div>
        {props.deleteAddress && (
          <div className="flexRow">
            <button
              type="button"
              variant="light"
              onClick={() => props.deleteAddress(id)}
            >
              <i className="fas fa-trash"></i>
              Delete
            </button>
          </div>
        )}
      </>
    );
  };
  if (props.withoutLayout) {
    return <div>{renderAddressForm()}</div>;
  }
  return (
    <div className="checkoutStep" style={{ background: "#f5faff" }}>
      <div className={`checkoutHeader`}>
        <div>
          <span className="stepNumber">+</span>
          <span className="stepTitle">{"ADD NEW ADDRESS"}</span>
        </div>
      </div>
      <div
        style={{
          padding: "0 60px",
          paddingBottom: "20px",
          boxSizing: "border-box",
        }}
      >
        {renderAddressForm()}
      </div>
    </div>
  );
};

export default AddressForm;
