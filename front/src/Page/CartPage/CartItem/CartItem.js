import React, { useState } from "react";
import { generatePublicUrl } from "../../../urlConfig";
import "./CartItem.css";

import Image from "../../../FormElements/Image";

import { isAuthenticated } from "../../../auth";

/**
 * @author
 * @function CartItem
 **/

const CartItem = (props) => {
  const [qty, setQty] = useState(props.cartItem.qty);

  const { _id, name, price, imageUrl, sold, quantity } = props.cartItem;

  const { user, token } = isAuthenticated();

  const onQuantityIncrement = () => {
    setQty(qty + 1);
    props.onQuantityInc(_id, qty + 1);
  };

  const onQuantityDecrement = () => {
    if (qty <= 1) return;
    setQty(qty - 1);
    props.onQuantityDec(_id, qty - 1);
  };

  return (
    <div className="cartItemContainer">
      <div className="flexRow">
        <div className="cartProImgContainer">
          <Image item={imageUrl} imageUrl={imageUrl} />
        </div>
        <div className="cartItemDetails">
          <div>
            <p>{name}</p>
            <p>Price. {price}</p>
            <p>Sold. {sold}</p>
            <p>Quantity. {quantity}</p>
          </div>
          <div>Delivery in 3 - 5 days</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          margin: "5px 0",
        }}
      >
        {/* quantity control */}
        <div className="quantityControl">
          <button onClick={onQuantityDecrement}>-</button>
          <input value={qty} readOnly />
          <button onClick={onQuantityIncrement}>+</button>
        </div>
        <button className="cartActionBtn">save for later</button>
        <button
          className="cartActionBtn"
          onClick={() =>
            props.onRemoveCartItem(user._id, isAuthenticated().token, _id)
          }
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
