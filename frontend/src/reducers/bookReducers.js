import {
  BOOK_FETCHING,
  BOOK_SUCCESS,
  BOOK_FAILED,
  BOOK_CLEAR,
  FETCHOPTION_SUCCESS,
} from "../constants/bookConstants";

const initialState = {
  isFetching: false,
  isError: false,
  result: null,
};

const bookReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case BOOK_FETCHING:
      return { ...state, isFetching: true, isError: false, result: null };
    case BOOK_SUCCESS:
      return { ...state, isFetching: false, isError: false, result: payload };
    case BOOK_FAILED:
      return { ...state, isFetching: false, isError: true, result: null };
    case BOOK_CLEAR:
      return { ...state, result: null, isFetching: false, isError: false };
    case FETCHOPTION_SUCCESS:
      return { ...state, isFetching: false, isError: false, options: payload };
    default:
      return state;
  }
};

export default bookReducers;
