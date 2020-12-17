import {
  initialDataConstants,
  categoryConstansts,
  productConstants,
  orderConstants,
} from "./constants";
import axios from "axios";

export const getInitialData = (userId, token) => {
  return async (dispatch) => {
    const res = await axios.get(
      `http://localhost:8090/api/initialData/${userId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      const { categories, products, orders } = res.data;
      dispatch({
        type: categoryConstansts.GET_ALL_CATEGORIES_SUCCESS,
        payload: { categories },
      });
      dispatch({
        type: productConstants.GET_ALL_PRODUCTS_SUCCESS,
        payload: { products },
      });
      dispatch({
        type: orderConstants.GET_CUSTOMER_ORDER_SUCCESS,
        payload: { orders },
      });
    }
    console.log(res);
  };
};
