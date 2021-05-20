import axiosClient from "../config/axiosClient";
import axios from "axios";
import { homeTypes, sortTypes } from "../constants/action.types";

export const setTopProduct = (data) => ({
  type: homeTypes.SET_TOP_PRODUCT,
  data,
});
export const getTopProduct = () => async (dispatch, getState) => {
  let res = null;
  try {
    res = await axiosClient.post("/bill/top/");
  } catch (err) {
    console.log(err);
    return;
  }
  dispatch(setTopProduct(res.data));
};

export const setCountProductBill = (data) => ({
  type: homeTypes.SET_COUNT_PRODUCT_BILL,
  data,
});
export const getCountProductBill = () => async (dispatch, getState) => {
  let res = null;
  try {
    res = await axiosClient.post("/bill/count-all-product-bill");
  } catch (err) {
    console.log(err);
    return;
  }
  dispatch(setCountProductBill(res.data));
};

export const setCountProductStock = (data) => ({
  type: homeTypes.SET_COUNT_PRODUCT_STOCK,
  data,
});
export const getCountProductStock = () => async (dispatch, getState) => {
  let res = null;
  try {
    res = await axiosClient.post("/bill/count-all-product");
  } catch (err) {
    console.log(err);
    return;
  }
  dispatch(setCountProductStock(res.data));
};

export const setCountBill = (data) => ({
  type: homeTypes.SET_COUNT_BILL,
  data,
});
export const getCountBill = () => async (dispatch, getState) => {
  let res = null;
  try {
    res = await axiosClient.post("/bill/count-all-bill");
  } catch (err) {
    console.log(err);
    return;
  }
  dispatch(setCountBill(res.data));
};

export const getCategory = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.get("http://localhost:8090/user/category");
  } catch (err) {
    return;
  }
  dispatch(setCategory(res.data.data));
};

export const getPublisher = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.get("http://localhost:8090/user/publisher");
  } catch (err) {
    return;
  }
  dispatch(setPublisher(res.data.data));
};

export const getAuthor = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.get("http://localhost:8090/user/author");
  } catch (err) {
    return;
  }
  dispatch(setAuthor(res.data.data));
};
export const getBook = () => async (dispatch, getState) => {
  let sorttype = "createdAt";
  let sortorder = "-1";
  let sortType = getState().homeReducers.book.sortType;
  if (sortType === sortTypes.SORT_DAY_DECREASED) {
    sorttype = "createdAt";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_DAY_INCREASED) {
    sorttype = "createdAt";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_PRICE_DECREASED) {
    sorttype = "price";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_PRICE_INCREASED) {
    sorttype = "price";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_SALES_DECREASED) {
    sorttype = "sales";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_SALES_INCREASED) {
    sorttype = "sales";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_VIEWS_DECREASED) {
    sorttype = "view_counts";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_VIEWS_INCREASED) {
    sorttype = "view_counts";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_NAME_INCREASED) {
    sorttype = "name";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_NAME_DECREASED) {
    sorttype = "name";
    sortorder = "-1";
  }
  let branch = getState().homeReducers.book.branch;
  let _link = "http://localhost:8090/book/allbook";
  if (branch === "category") {
    _link = "http://localhost:8090/book/category";
  } else if (branch === "publisher") {
    _link = "http://localhost:8090/book/publisher";
  } else if (branch === "author") {
    _link = "http://localhost:8090/book/author";
  }
  let res;
  // console.log(getState().homeReducers.book.pageSize);
  try {
    res = await axios.post(_link, {
      page: getState().homeReducers.book.page,
      pageSize: getState().homeReducers.book.pageSize,
      range: null,
      sorttype: sorttype,
      sortorder: sortorder,
      searchtext: getState().homeReducers.book.searchtext,
      id: getState().homeReducers.book.id,
    });
  } catch (err) {
    console.log(err.response);
    return;
  }
  dispatch(setBook(res.data.data));
  dispatch(setTotalPage(res.data.totalPage));
};

export const setBook = (data) => ({
  type: homeTypes.SET_BOOK,
  data,
});
export const setPage = (page) => ({
  type: homeTypes.SET_PAGE,
  page,
});
export const setPageSize = (pageSize) => ({
  type: homeTypes.SET_PAGE_SIZE,
  pageSize,
});
export const setTotalPage = (totalpage) => ({
  type: homeTypes.SET_TOTAL_PAGE,
  totalpage,
});
export const setCategory = (data) => ({
  type: homeTypes.SET_CATEGORY_BOOK,
  data,
});

export const setPublisher = (data) => ({
  type: homeTypes.SET_PUBLISHSER,
  data,
});

export const setAuthor = (data) => ({
  type: homeTypes.SET_AUTHOR,
  data,
});
export const setIDBranch = (id) => ({
  type: homeTypes.SET_ID_BRANCH,
  id,
});
export const backPage = () => (dispatch, getState) => {
  let page = getState().homeReducers.book.page;
  if (page > 1) {
    dispatch(setPage(parseInt(page) - 1));
  }
};

export const nextPage = () => (dispatch, getState) => {
  let page = getState().homeReducers.book.page;
  let totalpage = getState().homeReducers.book.totalpage;
  if (page < totalpage) {
    dispatch(setPage(parseInt(page) + 1));
  }
};
export const setSortType = (sortType) => async (dispatch, getState) => {
  dispatch(setPage(1));
  let sorttype = "createdAt";
  let sortorder = "-1";
  if (sortType === sortTypes.SORT_DAY_DECREASED) {
    sorttype = "createdAt";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_DAY_INCREASED) {
    sorttype = "createdAt";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_PRICE_DECREASED) {
    sorttype = "price";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_PRICE_INCREASED) {
    sorttype = "price";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_SALES_DECREASED) {
    sorttype = "sales";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_SALES_INCREASED) {
    sorttype = "sales";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_VIEWS_DECREASED) {
    sorttype = "view_counts";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_VIEWS_INCREASED) {
    sorttype = "view_counts";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_NAME_INCREASED) {
    sorttype = "name";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_NAME_DECREASED) {
    sorttype = "name";
    sortorder = "-1";
  }
  dispatch(setSort(sortType, sortorder));
  let branch = getState().homeReducers.book.branch;
  let _link = "http://localhost:8090/book/allbook";
  if (branch === "category") {
    _link = "http://localhost:8090/book/category";
  } else if (branch === "publisher") {
    _link = "http://localhost:8090/book/publisher";
  } else if (branch === "author") {
    _link = "http://localhost:8090/book/author";
  }
  let res;
  try {
    res = await axios.post(_link, {
      page: 1,
      pageSize: 10,
      range: getState().homeReducers.book.range,
      sorttype: sorttype,
      sortorder: sortorder,
      searchtext: getState().homeReducers.book.searchtext,
      id: getState().homeReducers.book.id,
    });
  } catch (err) {
    console.log(err.response);
    return;
  }
  dispatch(setBook(res.data.data));
  dispatch(setTotalPage(res.data.totalPage));
};
export const setSort = (sortType) => ({
  type: homeTypes.SET_SORT_TYPE,
  sortType,
});
export const setRangeType = (range) => async (dispatch, getState) => {
  dispatch(setPage(1));
  let sorttype = "createdAt";
  let sortorder = "-1";
  let sortType = getState().homeReducers.book.sortType;
  if (sortType === sortTypes.SORT_DAY_DECREASED) {
    sorttype = "createdAt";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_DAY_INCREASED) {
    sorttype = "createdAt";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_PRICE_DECREASED) {
    sorttype = "price";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_PRICE_INCREASED) {
    sorttype = "price";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_SALES_DECREASED) {
    sorttype = "sales";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_SALES_INCREASED) {
    sorttype = "sales";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_VIEWS_DECREASED) {
    sorttype = "view_counts";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_VIEWS_INCREASED) {
    sorttype = "view_counts";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_NAME_INCREASED) {
    sorttype = "name";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_NAME_DECREASED) {
    sorttype = "name";
    sortorder = "-1";
  }
  let branch = getState().homeReducers.book.branch;
  let _link = "http://localhost:8090/book/allbook";
  if (branch === "category") {
    _link = "http://localhost:8090/book/category";
  } else if (branch === "publisher") {
    _link = "http://localhost:8090/book/publisher";
  } else if (branch === "author") {
    _link = "http://localhost:8090/book/author";
  }
  let res;

  // console.log(getState().homeReducers.book.id);

  try {
    res = await axios.post(_link, {
      page: 1,
      pageSize: 10,
      range: range,
      sorttype: sorttype,
      sortorder: sortorder,
      id: getState().homeReducers.book.id,
      searchtext: getState().homeReducers.book.searchtext,
    });
  } catch (err) {
    console.log(err.response);
    return;
  }
  // console.log(JSON.stringify(res));
  dispatch(setRange(range));
  dispatch(setBook(res.data.data));
  dispatch(setTotalPage(res.data.totalPage));
};

export const setRange = (range) => ({
  type: homeTypes.SET_RANGE,
  range,
});
export const setBranch = (branch) => ({
  type: homeTypes.SET_BRANCH_SEARCH_BOOK,
  branch,
});
export const setTitle = (title) => ({
  type: homeTypes.SET_NAME_TITLE_ITEM,
  title,
});
export const setSearchText = (searchtext) => ({
  type: homeTypes.SET_SEARCH_TEXT,
  searchtext,
});

export const branchClick = (branch, id) => async (dispatch, getState) => {
  let _link = "http://localhost:8090/book/allbook";
  if (branch === "category") {
    _link = "http://localhost:8090/book/category";
  } else if (branch === "publisher") {
    _link = "http://localhost:8090/book/publisher";
  } else if (branch === "author") {
    _link = "http://localhost:8090/book/author";
  }
  let res;
  try {
    res = await axios.post(_link, {
      page: 1,
      pageSize: 10,
      range: undefined,
      sorttype: undefined,
      sortorder: undefined,
      id: id,
      searchtext: undefined,
    });
  } catch (err) {
    return;
  }
  dispatch(setSearchText(""));
  dispatch(setBook(res.data.data));
  dispatch(setTotalPage(res.data.totalPage));
};

export const searchTextSubmit = () => async (dispatch, getState) => {
  dispatch(setPage(1));
  let sorttype = "createdAt";
  let sortorder = "-1";
  let sortType = getState().homeReducers.book.sortType;
  if (sortType === sortTypes.SORT_DAY_DECREASED) {
    sorttype = "createdAt";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_DAY_INCREASED) {
    sorttype = "createdAt";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_PRICE_DECREASED) {
    sorttype = "price";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_PRICE_INCREASED) {
    sorttype = "price";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_SALES_DECREASED) {
    sorttype = "sales";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_SALES_INCREASED) {
    sorttype = "sales";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_VIEWS_DECREASED) {
    sorttype = "view_counts";
    sortorder = "-1";
  } else if (sortType === sortTypes.SORT_VIEWS_INCREASED) {
    sorttype = "view_counts";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_NAME_INCREASED) {
    sorttype = "name";
    sortorder = "1";
  } else if (sortType === sortTypes.SORT_NAME_DECREASED) {
    sorttype = "name";
    sortorder = "-1";
  }
  let branch = getState().homeReducers.book.branch;
  console.log(branch);
  let _link = "http://localhost:8090/book/allbook";
  if (branch === "category") {
    _link = "http://localhost:8090/book/category";
  } else if (branch === "publisher") {
    _link = "http://localhost:8090/book/publisher";
  } else if (branch === "author") {
    _link = "http://localhost:8090/book/author";
  }
  let res;
  // console.log(getState().homeReducers.book.searchtext)
  try {
    if (getState().homeReducers.book.searchtext === "") {
      const titleName = "ALL BOOK";
      res = await axios.post("http://localhost:8090/book/allbook", {
        page: 1,
        pageSize: 10,
        range: null,
        sorttype: sorttype,
        sortorder: sortorder,
        // id: getState().homeReducers.book.id,
        searchtext: getState().homeReducers.book.searchtext,
      });
      // console.log(getState().homeReducers.book.branch)
      dispatch(setBranch(""));
      dispatch(setTitle(titleName));
    } else {
      res = await axios.post(_link, {
        page: 1,
        pageSize: 10,
        range: getState().homeReducers.book.range,
        sorttype: sorttype,
        sortorder: sortorder,
        id: getState().homeReducers.book.id,
        searchtext: getState().homeReducers.book.searchtext,
      });
    }
  } catch (err) {
    console.log(err.response);
    return;
  }
  dispatch(setBook(res.data.data));
  dispatch(setTotalPage(res.data.totalPage));
};

export const setListProductIds = (data) => ({
  type: homeTypes.SET_LIST_PRODUCT_IDS,
  data,
});
export const getListBookIds = (ids) => async (dispatch, getState) => {
  let res;
  console.log(ids);
  try {
    res = await axios.post("http://localhost:8090/api/get-list-books", {
      ids,
    });
  } catch (err) {
    return;
  }
  dispatch(setListProductIds(res.data.data));
};
export const setListProductCategoryIds = (data) => ({
  type: homeTypes.SET_LIST_PRODUCT_CATEGORY_IDS,
  data,
});
export const getListProductCategoryIds = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.post(
      "http://localhost:8090/api/get-list-category-ids",
      {}
    );
  } catch (err) {
    return;
  }
  dispatch(setListProductCategoryIds(res.data.data));
};

export const setListProductRankTop5 = (data) => ({
  type: homeTypes.SET_LIST_PRODUCT_RANK_TOP_5,
  data,
});
export const getListProductRankTop5 =
  (values) => async (dispatch, getState) => {
    let res;
    try {
      res = await axios.post(
        "http://localhost:8090/api/get-rating-rank-product-top-5",
        {
          id_category: values,
        }
      );
    } catch (err) {
      return;
    }
    dispatch(setListProductRankTop5(res.data.data));
  };
export const getListProductRankTopAll =
  (values) => async (dispatch, getState) => {
    // console.log(values);
    try {
      const { data } = await axios.post(
        `http://localhost:8090/api/get-rating-rank-product-all`,
        {
          id_category: values,
        }
      );
      // console.log(data);
      dispatch({
        type: homeTypes.SET_LIST_PRODUCT_RANK_TOP_ALL,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getListProductTop10ByCategory =
  (id_category, pageNumber) => async (dispatch, getState) => {
    // console.log(values);
    try {
      const { data } = await axios.post(
        `http://localhost:8090/api/get-product-by-category-top-10`,
        {
          id_category,
          pageNumber,
        }
      );
      // console.log(data);
      dispatch({
        type: homeTypes.SET_LIST_PRODUCT_TOP_10_BY_CATEGORY,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };
// export const getListProductTop10ByCategory =
//   (values) => async (dispatch, getState) => {
//     // console.log(values);
//     try {
//       const { data } = await axios.post(
//         `http://localhost:8090/api/get-product-by-category-top-10`,
//         { id_category: values }
//       );
//       // console.log(data);
//       dispatch({
//         type: homeTypes.SET_LIST_PRODUCT_TOP_10_BY_CATEGORY,
//         payload: data,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };
export const setPageSizeListProductByCategory = (data) => ({
  type: homeTypes.SET_PAGE_SIZE_LIST_PRODUCT_BY_CATEGORY,
  data,
});
export const setListProductByCategory = (data) => ({
  type: homeTypes.SET_LIST_PRODUCT_BY_CATEGORY,
  data,
});
export const getListProductByCategory =
  ({
    pageNumber = "",
    pageSize = "",
    published = "",
    name = "",
    id_category = "",
    order = "",
    min = 0,
    max = 0,
    stars = 0,
    sales = "",
    updatedAtByDay = "",
  }) =>
  async (dispatch, getState) => {
    // console.log(values);
    try {
      const { data } = await axios.post(
        `http://localhost:8090/api/get-product-by-category-all-pagination?pageNumber=${pageNumber}&pageSize=${pageSize}&published=${published}&name=${name}&id_category=${id_category}&min=${min}&max=${max}&stars=${stars}&sales=${sales}&updatedAtByDay=${updatedAtByDay}&order=${order}`,
        {
          // skip: values.toSkip,
          // limit: values.limit,
        }
      );
      console.log(data);
      dispatch({ type: homeTypes.SET_LIST_PRODUCT_BY_CATEGORY, payload: data });
    } catch (err) {
      return;
    }
    // dispatch(setListProductByCategory(res.data));
    // dispatch({ type: homeTypes.SET_LIST_PRODUCT_BY_CATEGORY, payload: data });
  };

export const getListProductSoldTop10ByDay =
  () => async (dispatch, getState) => {
    // console.log(values);
    try {
      const { data } = await axios.post(
        `http://localhost:8090/api/get-best-seller-product-top-5/by-day`,
        {}
      );
      // console.log(data);
      dispatch({
        type: homeTypes.SET_LIST_PRODUCT_SOLD_TOP_10_BY_DAY,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };
export const getListProductSoldTopAllByDay =
  (values) => async (dispatch, getState) => {
    // console.log(values);
    try {
      const { data } = await axios.post(
        `http://localhost:8090/api/get-best-seller-product-all-pagination/by-day`,
        {}
      );
      // console.log(data);
      dispatch({
        type: homeTypes.SET_LIST_PRODUCT_SOLD_TOP_ALL_BY_DAY,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getListProductSoldTop10ByWeek =
  (values, pageNumber) => async (dispatch, getState) => {
    // console.log(values);
    try {
      const { data } = await axios.post(
        `http://localhost:8090/api/get-best-seller-product-all-pagination/by-week`,
        { id_category: values, pageNumber, week: 1 }
      );
      // console.log(data);
      dispatch({
        type: homeTypes.SET_LIST_PRODUCT_SOLD_TOP_ALL_BY_WEEK,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };
export const getListProductSoldTopAllByWeek =
  (values) => async (dispatch, getState) => {
    // console.log(values);
    try {
      const { data } = await axios.post(
        `http://localhost:8090/api/get-best-seller-product-top-10/by-week`,
        {}
      );
      // console.log(data);
      dispatch({
        type: homeTypes.SET_LIST_PRODUCT_SOLD_TOP_ALL_BY_WEEK,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const getListProductFavorTop2 =
  (values) => async (dispatch, getState) => {
    // console.log(values);
    try {
      const { data } = await axios.post(
        `http://localhost:8090/api/get-favor-product`,
        {}
      );
      // console.log(data);
      dispatch({
        type: homeTypes.SET_LIST_FAVOR_PRODUCT_TOP_2,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };
export const getListProductBestSellerTop10 =
  (values) => async (dispatch, getState) => {
    // console.log(values);
    try {
      const { data } = await axios.post(
        `http://localhost:8090/get/best-seller`,
        {}
      );
      // console.log(data);
      dispatch({
        type: homeTypes.SET_LIST_BEST_SELLER_PRODUCT_TOP_10,
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };
