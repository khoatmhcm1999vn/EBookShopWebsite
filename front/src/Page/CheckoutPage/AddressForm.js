import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../../actions";
// import { MaterialButton, MaterialInput } from "../../components/MaterialUI";

import { isAuthenticated } from "../../auth";

/**
 * @author
 * @function AddressForm
 **/

const AddressForm = (props) => {
  const { initialData } = props;
  const [name, setName] = useState(initialData ? initialData.name : "");
  const [mobileNumber, setMobileNumber] = useState(
    initialData ? initialData.mobileNumber : ""
  );
  const [pinCode, setPinCode] = useState(
    initialData ? initialData.pinCode : ""
  );
  const [locality, setLocality] = useState(
    initialData ? initialData.locality : ""
  );
  const [address, setAddress] = useState(
    initialData ? initialData.address : ""
  );
  const [cityDistrictTown, setCityDistrictTown] = useState(
    initialData ? initialData.cityDistrictTown : ""
  );
  const [state, setState] = useState(initialData ? initialData.state : "");
  const [landmark, setLandmark] = useState(
    initialData ? initialData.landmark : ""
  );
  const [alternatePhone, setAlternatePhone] = useState(
    initialData ? initialData.alternatePhone : ""
  );
  const [addressType, setAddressType] = useState(
    initialData ? initialData.addressType : ""
  );
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [submitFlag, setSubmitFlag] = useState(false);
  const [id, setId] = useState(initialData ? initialData._id : "");

  const { token } = isAuthenticated();

  const inputContainer = {
    width: "100%",
    marginRight: 10,
  };

  const onAddressSubmit = (e) => {
    const payload = {
      address: {
        name,
        mobileNumber,
        pinCode,
        locality,
        address,
        cityDistrictTown,
        state,
        landmark,
        alternatePhone,
        addressType,
      },
    };
    console.log(payload);
    if (id) {
      payload.address._id = id;
    }
    dispatch(addAddress(isAuthenticated().user._id, token, payload));
    setSubmitFlag(true);
  };

  useEffect(() => {
    console.log("addressCount", user.address);
    if (submitFlag) {
      console.log("where are we", user);
      let _address = {};
      if (id) {
        _address = {
          _id: id,
          name,
          mobileNumber,
          pinCode,
          locality,
          address,
          cityDistrictTown,
          state,
          landmark,
          alternatePhone,
          addressType,
        };
      } else {
        _address = user.address.slice(user.address.length - 1)[0];
      }

      props.onSubmitForm(_address);
    }
  }, [user.address]);

  const renderAddressForm = () => {
    return (
      <>
        <div className="flexRow">
          <div style={inputContainer}>
            <label
              // className={`label ${focus ? "focus" : ""}`}
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              Name && Enter Name
            </label>
            <input
              // label="Name"

              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={inputContainer}>
            <label
              // className={`label ${focus ? "focus" : ""}`}
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              Mobile Number && Enter Mobile Number
            </label>
            <input
              label="10-digit mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="flexRow">
          <div style={inputContainer}>
            <label
              // className={`label ${focus ? "focus" : ""}`}
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              Pincode && Enter Pincode
            </label>
            <input
              label="Pincode"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
          </div>
          <div style={inputContainer}>
            <label
              // className={`label ${focus ? "focus" : ""}`}
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              Locality && Enter Locality
            </label>
            <input
              label="Locality"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
            />
          </div>
        </div>
        <div className="flexRow">
          <div style={inputContainer}>
            <label
              // className={`label ${focus ? "focus" : ""}`}
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              Address && Enter Address
            </label>
            <input
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="flexRow">
          <div style={inputContainer}>
            <label
              // className={`label ${focus ? "focus" : ""}`}
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              City District Town && Enter City District Town
            </label>
            <input
              label="City/District/Town"
              value={cityDistrictTown}
              onChange={(e) => setCityDistrictTown(e.target.value)}
            />
          </div>
          <div style={inputContainer}>
            <label
              // className={`label ${focus ? "focus" : ""}`}
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              State && Enter State
            </label>
            <input
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>
        <div className="flexRow">
          <div style={inputContainer}>
            <label
              // className={`label ${focus ? "focus" : ""}`}
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              Landmark && Enter LandMark (Optional)
            </label>
            <input
              label="Landmark (Optional)"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>
          <div style={inputContainer}>
            <label
              // className={`label ${focus ? "focus" : ""}`}
              style={{
                top: 0,
                lineHeight: "none",
              }}
            >
              Alternate Phone && Enter Alternate Phone (Optional)
            </label>
            <input
              label="Alternate Phone (Optional)"
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label>Address Type</label>
          <div className="flexRow">
            <div>
              <input
                type="radio"
                onClick={() => setAddressType("home")}
                name="addressType"
                value="home"
              />
              <span>Home</span>
            </div>
            <div>
              <input
                type="radio"
                onClick={() => setAddressType("work")}
                name="addressType"
                value="work"
              />
              <span>Work</span>
            </div>
          </div>
        </div>
        <div className="flexRow">
          <button
            title="SAVE AND DELIVER HERE"
            onClick={onAddressSubmit}
            style={{
              width: "250px",
              margin: "20px 0",
            }}
          >
            Save and Delivery here
          </button>
        </div>
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
