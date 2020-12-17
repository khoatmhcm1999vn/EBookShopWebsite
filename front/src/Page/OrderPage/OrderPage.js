import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders } from "../../actions";
import Layout from "../../Layout/Layout";
import Card from "../../Card/Card";

import { BiRupee } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";

import { isAuthenticated } from "../../auth";

import Image from "../../FormElements/Image";

import "./OrderPage.css";

/**
 * @author
 * @function OrderPage
 **/

const OrderPage = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const userx1 = isAuthenticated().user;

  useEffect(() => {
    dispatch(getOrders(isAuthenticated().user._id, isAuthenticated().token));
  }, []);

  console.log(user);

  return (
    <Layout
      title={`Welcome to ${userx1.name} Orders`}
      description="Go and Check your order"
      className="container-fluid"
    >
      <div style={{ maxWidth: "1160px", margin: "5px auto" }}>
        {/* <button
          breed={[
            { name: "Home", href: "/" },
            { name: "My Account", href: "/account" },
            { name: "My Orders", href: "/account/orders" },
          ]}
          breedIcon={<IoIosArrowForward />}
        /> */}
        {user.orders.map((order) => {
          return order.items.map((item) => (
            <Card style={{ display: "block", margin: "5px 0" }}>
              <Link
                to={`/order_details/${order._id}`}
                className="orderItemContainer"
              >
                <div className="orderImgContainer">
                  <Image
                    item={item.product.imageUrl}
                    imageUrl={item.product.imageUrl}
                  />
                </div>
                <div className="orderRow">
                  <div className="orderName">{item.product.name}</div>
                  <div className="orderPrice">
                    <BiRupee />
                    {item.payablePrice}
                  </div>
                  <div>{order.paymentStatus}</div>
                  <div className="col-3">{order.paymentType}</div>
                </div>
              </Link>
            </Card>
          ));
        })}
      </div>
    </Layout>
  );
};

export default OrderPage;
