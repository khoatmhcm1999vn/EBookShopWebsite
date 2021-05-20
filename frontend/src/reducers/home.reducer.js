import { homeTypes, sortTypes } from "../constants/action.types";
import { combineReducers } from "redux";

const home = (
  state = {
    top_product: [],
    countProductBill: 0,
    countProductStock: 0,
    countBill: 0,
  },
  action
) => {
  switch (action.type) {
    case homeTypes.SET_TOP_PRODUCT: {
      return {
        ...state,
        top_product: action.data,
      };
    }

    case homeTypes.SET_COUNT_PRODUCT_BILL: {
      return {
        ...state,
        countProductBill: action.data,
      };
    }

    case homeTypes.SET_COUNT_PRODUCT_STOCK: {
      return {
        ...state,
        countProductStock: action.data,
      };
    }

    case homeTypes.SET_COUNT_BILL: {
      return {
        ...state,
        countBill: action.data,
      };
    }

    default:
      return state;
  }
};

const category = (state = { data: [] }, action) => {
  switch (action.type) {
    case homeTypes.SET_CATEGORY_BOOK: {
      return {
        ...state,
        data: action.data,
      };
    }
    default:
      return state;
  }
};
const publisher = (state = { data: [] }, action) => {
  switch (action.type) {
    case homeTypes.SET_PUBLISHSER: {
      return {
        ...state,
        data: action.data,
      };
    }
    default:
      return state;
  }
};
const author = (state = { data: [] }, action) => {
  switch (action.type) {
    case homeTypes.SET_AUTHOR: {
      return {
        ...state,
        data: action.data,
      };
    }
    default:
      return state;
  }
};

const book = (
  state = {
    data: [],
    page: 1,
    pageSize: 10,
    totalpage: null,
    title: "ALL BOOK",
    searchtext: "",
    sortType: sortTypes.SORT_DAY_DECREASED,
    sortOrder: -1,
    dataIds: [],
    dataTop5Rank: [],
    dataTopAllRank: [],
    dataByCategory: [],
    dataTop10ByCategory: [],
    pageSizeByCategory: 0,
    dataProductCategoryIds: [],
    dataProductSoldTop10ByDay: [],
    dataProductSoldTopAllByDay: [],
    dataProductSoldTop10ByWeek: [],
    dataProductSoldTopAllByWeek: [],
    dataProductFavorTop2: [],
    dataProductBestSellerTop10: [],
  },
  action
) => {
  switch (action.type) {
    case homeTypes.SET_BOOK: {
      return {
        ...state,
        data: action.data,
      };
    }

    case homeTypes.SET_LIST_FAVOR_PRODUCT_TOP_2: {
      return {
        ...state,
        dataProductFavorTop2: action.payload.products,
      };
    }
    case homeTypes.SET_LIST_BEST_SELLER_PRODUCT_TOP_10: {
      return {
        ...state,
        dataProductBestSellerTop10: action.payload.products,
      };
    }

    case homeTypes.SET_LIST_PRODUCT_IDS: {
      return {
        ...state,
        dataIds: action.data,
      };
    }
    case homeTypes.SET_LIST_PRODUCT_CATEGORY_IDS: {
      return {
        ...state,
        dataProductCategoryIds: action.data,
      };
    }

    case homeTypes.SET_LIST_PRODUCT_RANK_TOP_5: {
      return {
        ...state,
        dataTop5Rank: action.data,
      };
    }
    case homeTypes.SET_LIST_PRODUCT_RANK_TOP_ALL: {
      return {
        ...state,
        dataTopAllRank: action.payload.data,
      };
    }

    case homeTypes.SET_LIST_PRODUCT_TOP_10_BY_CATEGORY: {
      return {
        ...state,
        dataTop10ByCategory: action.payload.data,
        totalPageCateTop10: action.payload.totalPage,
        currPageCateTop10: action.payload.currPage,
        pageSizeOnePage: action.payload.pageSizeOnePage,
      };
    }
    case homeTypes.SET_LIST_PRODUCT_BY_CATEGORY: {
      return {
        ...state,
        dataByCategory: action.payload.products,
        pagesCate: action.payload.pages,
        pageCate: action.payload.page,
      };
    }
    case homeTypes.SET_PAGE_SIZE_LIST_PRODUCT_BY_CATEGORY: {
      return {
        ...state,
        pageSizeByCategory: action.data,
      };
    }

    case homeTypes.SET_LIST_PRODUCT_SOLD_TOP_10_BY_DAY: {
      return {
        ...state,
        dataProductSoldTop10ByDay: action.payload.data,
      };
    }
    case homeTypes.SET_LIST_PRODUCT_SOLD_TOP_ALL_BY_DAY: {
      return {
        ...state,
        dataProductSoldTopAllByDay: action.payload.data,
      };
    }

    case homeTypes.SET_LIST_PRODUCT_SOLD_TOP_10_BY_WEEK: {
      return {
        ...state,
        dataProductSoldTop10ByWeek: action.payload.data,
      };
    }
    case homeTypes.SET_LIST_PRODUCT_SOLD_TOP_ALL_BY_WEEK: {
      return {
        ...state,
        dataProductSoldTopAllByWeek: action.payload.data,
        totalPageProductSoldTopAllByWeek: action.payload.totalPage,
        currPageProductSoldTopAllByWeek: action.payload.currPage,
        pageSizeOnePageProductSoldTopAllByWeek: action.payload.pageSizeOnePage,
      };
    }

    case homeTypes.SET_PAGE: {
      return {
        ...state,
        page: action.page,
      };
    }
    case homeTypes.SET_PAGE_SIZE: {
      return {
        ...state,
        page: 1,
        pageSize: action.pageSize,
      };
    }
    case homeTypes.SET_TOTAL_PAGE: {
      return {
        ...state,
        totalpage: action.totalpage,
      };
    }
    case homeTypes.SET_SORT_TYPE: {
      return {
        ...state,
        sortType: action.sortType,
        sortOrder: action.sortOrder,
      };
    }
    case homeTypes.SET_RANGE: {
      return {
        ...state,
        range: action.range,
      };
    }
    case homeTypes.SET_NAME_TITLE_ITEM: {
      return {
        ...state,
        title: action.title,
      };
    }
    case homeTypes.SET_BRANCH_SEARCH_BOOK: {
      return {
        ...state,
        branch: action.branch,
      };
    }
    case homeTypes.SET_ID_BRANCH: {
      return {
        ...state,
        id: action.id,
      };
    }
    case homeTypes.RESET_BOOK: {
      return {
        data: [],
        page: 1,
        pageSize: 10,
        totalpage: null,
        title: "ALL BOOK",
        sortType: sortTypes.SORT_DAY_DECREASED,
        sortOrder: -1,
      };
    }
    case homeTypes.SET_SEARCH_TEXT: {
      return {
        ...state,
        searchtext: action.searchtext,
      };
    }

    default:
      return state;
  }
};

export default combineReducers({
  home,
  category,
  publisher,
  book,
  author,
});
