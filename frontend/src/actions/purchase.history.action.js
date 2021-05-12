import axiosClient from "../config/axiosClient";
import storeConfig from "../config/store.config";
import { purchaseHistoryTypes } from "../constants/action.types";

export const setPurchaseHistory = (data) => ({
  type: purchaseHistoryTypes.SET_PURCHASED_HISTORY,
  data,
});
export const setTotalPage = (totalpage) => ({
  type: purchaseHistoryTypes.SET_PURCHASE_TOTAL_PAGE,
  totalpage,
});
export const setPage = (page) => ({
  type: purchaseHistoryTypes.SET_PURCHASE_PAGE,
  page,
});
export const getPurchaseHitory = () => async (dispatch, getState) => {
  const page = getState().purchaseReducers.purchaseHistory.page;
  // console.log(page);
  let res = null;
  let user = storeConfig.getUser();
  if (user === null) return;
  try {
    res = await axiosClient.get(`/bill/list/${user.id}/${page}`);
    // console.log(res)
  } catch (err) {
    console.log(err);
    return;
  }
  dispatch(setPurchaseHistory(res.data));
  dispatch(setTotalPage(res.totalPage));
};
export const deleteBill = (id) => async (dispatch, getState) => {
  try {
    await axiosClient.get("/bill/delete/" + id);
  } catch (err) {
    console.log(err.response);
  }
  dispatch(getPurchaseHitory());
};
