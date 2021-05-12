import {
  BILL_FETCHING,
  BILL_SUCCESS,
  BILL_FAILED,
  BILL_CLEAR,
} from "../constants/billConstants";

const initialState = {
  isFetching: false,
  isError: false,
  result: null,
};

const billReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case BILL_FETCHING:
      return { ...state, isFetching: true, isError: false, result: null };
    case BILL_SUCCESS:
      return { ...state, isFetching: false, isError: false, result: payload };
    case BILL_FAILED:
      return { ...state, isFetching: false, isError: true, result: null };
    case BILL_CLEAR:
      return { ...state, result: null, isFetching: false, isError: false };
    default:
      return state;
  }
};

export default billReducers;
