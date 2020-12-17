import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "../../actions";
import Layout from "../../Layout/Layout";
import Card from "../../Card/Card";

import { Link } from "react-router-dom";

import "./OrderDetailsPage.css";

import { isAuthenticated } from "../../auth";

/**
 * @author
 * @function OrderDetails
 **/

const OrderDetailsPage = (props) => {
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.user.orderDetails);

  useEffect(() => {
    console.log({ props });
    const payload = {
      orderId: props.match.params.orderId,
    };
    dispatch(
      getOrder(isAuthenticated().user._id, isAuthenticated().token, payload)
    );
  }, []);

  if (!(orderDetails && orderDetails.address)) {
    return null;
  }

  return (
    <Layout
      title={`Your Order Detail`}
      description="View Order Details"
      className="container-fluid"
    >
      <div
        style={{
          width: "1160px",
          margin: "10px auto",
        }}
      >
        <Card>
          <div className="delAdrContainer">
            <div className="delAdrDetails">
              <div className="delTitle">Delivery Address</div>
              <div className="delName">{orderDetails.address.name}</div>
              <div className="delAddress">{orderDetails.address.address}</div>
              <div className="delPhoneNumber">
                Phone number {orderDetails.address.mobileNumber}
              </div>
            </div>
            <div className="delMoreActionContainer">
              <div className="delTitle">More Actions</div>
              <div className="delName">Download Invoice</div>
            </div>
          </div>
        </Card>
        <Card>
          <Link to="/account/orders">Back</Link>
          <div className="">
            <h3>Total Amount: {orderDetails.totalAmount}$</h3>
            <div>Items</div>
            <div>Order Status {orderDetails.paymentStatus}</div>
            <div>
              {orderDetails.items.map((o, i) => {
                return (
                  <div key={i}>
                    Price {o.payablePrice}$ | Name {o.product.name} | Quantity{" "}
                    {o.purchasedQty}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderDetailsPage;
