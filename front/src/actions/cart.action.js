// import axios from "../utils/HttpClient";
import { cartConstants } from "./constants";
import store from "../store";

import axios from "axios";

import { isAuthenticated } from "../auth";

// const {
//   user: { _id },
// } = isAuthenticated();

const getCartItems = (userId, token) => {
  return async (dispatch) => {
    try {
      dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
      const res = await axios.post(
        `http://localhost:8090/api/user/getCartItems/${userId}`,
        null,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        const { cartItems } = res.data;
        console.log({ getCartItems: cartItems });
        if (cartItems) {
          dispatch({
            type: cartConstants.ADD_TO_CART_SUCCESS,
            payload: { cartItems },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const addToCart = (userId, token, product, newQty = 1) => {
  return async (dispatch) => {
    const {
      cart: { cartItems },
      auth,
    } = store.getState();
    //console.log('action::products', products);
    //const product = action.payload.product;
    //const products = state.products;
    const qty = cartItems[product._id]
      ? parseInt(cartItems[product._id].qty + newQty)
      : 1;
    cartItems[product._id] = {
      ...product,
      qty,
    };

    if (isAuthenticated()) {
      dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
      const payload = {
        // cartItems: Object.keys(cartItems).map((key, index) => {
        //     return {
        //         quantity: cartItems[key].qty,
        //         product: cartItems[key]._id
        //     }
        // })
        cartItems: [
          {
            product: product._id,
            count: qty,
            name: product.name,
            description: product.description,
            quantity: product.quantity,
            sold: product.sold,
          },
        ],
      };
      console.log(payload);
      const res = await axios.post(
        `http://localhost:8090/api/user/cart/addtocart/${userId}`,
        payload,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      if (res.status === 201) {
        dispatch(getCartItems(userId, token));
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    console.log("addToCart::", cartItems);

    dispatch({
      type: cartConstants.ADD_TO_CART_SUCCESS,
      payload: { cartItems },
    });
  };
};

export const removeCartItem = (userId, token, payload) => {
  return async (dispatch) => {
    try {
      dispatch({ type: cartConstants.REMOVE_CART_ITEM_REQUEST });
      const res = await axios.post(
        `http://localhost:8090/api/user/cart/removeItem/${userId}`,
        { payload },
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 202) {
        dispatch({ type: cartConstants.REMOVE_CART_ITEM_SUCCESS });
        dispatch(getCartItems(userId, token));
      } else {
        const { error } = res.data;
        dispatch({
          type: cartConstants.REMOVE_CART_ITEM_FAILURE,
          payload: { error },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateCart = (userId, token) => {
  return async (dispatch) => {
    const { auth } = store.getState();
    let cartItems = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : null;

    console.log("upppppppppp");

    if (isAuthenticated()) {
      localStorage.removeItem("cart");
      //dispatch(getCartItems());
      if (cartItems) {
        const payload = {
          cartItems: Object.keys(cartItems).map((key, index) => {
            return {
              quantity: cartItems[key].qty,
              product: cartItems[key]._id,
            };
          }),
        };
        if (Object.keys(cartItems).length > 0) {
          const res = await axios.post(
            `http://localhost:8090/api/user/cart/addtocart/${userId}`,
            payload,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.status === 201) {
            dispatch(getCartItems(userId, token));
          }
        }
      }
    } else {
      if (cartItems) {
        dispatch({
          type: cartConstants.ADD_TO_CART_SUCCESS,
          payload: { cartItems },
        });
      }
    }
  };
};

export { getCartItems };
