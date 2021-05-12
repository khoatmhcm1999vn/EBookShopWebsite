import { combineReducers } from "redux";
import { purchaseHistoryTypes } from "../constants/action.types";

const purchaseHistory = (
  state = { data: [], page: 1, totalpage: null },
  action
) => {
  switch (action.type) {
    case purchaseHistory.SET_PURCHASE_PAGE: {
      return {
        ...state,
        page: action.page,
      };
    }
    case purchaseHistory.SET_PURCHASE_TOTAL_PAGE: {
      return {
        ...state,
        totalpage: action.totalpage,
      };
    }
    case purchaseHistoryTypes.SET_PURCHASED_HISTORY: {
      return {
        ...state,
        data: action.data,
      };
    }
    default:
      return state;
  }
};
export default combineReducers({
  purchaseHistory,
});
