import { categoryConstansts } from "../actions/constants";

const initState = {
  categories: [],
  loading: false,
  error: null,
};

export default (state = initState, action) => {
  switch (action.type) {
    case categoryConstansts.GET_ALL_CATEGORIES_SUCCESS:
      state = {
        ...state,
        categories: action.payload.categories,
      };
      break;

    default:
  }
  return state;
};
