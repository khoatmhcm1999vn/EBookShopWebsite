import axios from "axios";
import axiosClient from "../config/axiosClient";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { bookTypes, productTypes } from "../constants/action.types";

export const getBook = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.post(`${process.env.REACT_APP_API_URL}/api/getAllBook`, {
      // page: getState().bookReducers.book.page,
      // range: null,
    });
  } catch (err) {
    console.log(err);
    return;
  }
  dispatch(setBook(res.data.data));
  // dispatch(setTotalPage(res.data.totalPage));
};
export const bulk_delete = (id) => {
  console.log(id);
  return async (dispatch) => {
    console.log("remove");
    const response = await axiosClient.delete(`/book/bulk_delete/${id}`);
    if (response.result === "success") {
      dispatch(getBook());
    } else if (response.result === "error") {
      swal("Error!", response.message, "error");
    }
  };
};
export const setBook = (data) => ({
  type: bookTypes.SET_BOOK,
  data,
});
export const setPage = (page) => ({
  type: bookTypes.SET_PAGE,
  page,
});
export const setTotalPage = (totalpage) => ({
  type: bookTypes.SET_TOTAL_PAGE,
  totalpage,
});
export const authorSetPage = (page) => ({
  type: bookTypes.AUTHOR_SET_PAGE,
  page,
});
export const authorSetTotalPage = (totalpage) => ({
  type: bookTypes.AUTHOR_SET_TOTAL_PAGE,
  totalpage,
});
export const categorySetPage = (page) => ({
  type: bookTypes.CATEGORY_SET_PAGE,
  page,
});
export const categorySetTotalPage = (totalpage) => ({
  type: bookTypes.CATEGORY_SET_TOTAL_PAGE,
  totalpage,
});
export const publisherSetPage = (page) => ({
  type: bookTypes.PUBLISHER_SET_PAGE,
  page,
});
export const publisherSetTotalPage = (totalpage) => ({
  type: bookTypes.PUBLISHER_SET_TOTAL_PAGE,
  totalpage,
});
export const deleteBook = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.get("/admin/deletebook/" + id);
    if (res.result === "success") {
      swal("Success!", res.message, "success");
    } else if (res.result === "error") {
      swal("Error!", res.message, "error");
    }
  } catch (err) {
    swal("Error!", res.message, "error");
    console.log(err);
    return;
  }
  // console.log(res);
  dispatch(getBook());
};

export const deactivateBook = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.get("/admin/deactivatebook/" + id);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    console.log(err);
    return;
  }
  dispatch(getBook());
};

export const getCategory = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/category/all/${
        getState().bookReducers.category.page
      }`
    );
  } catch (err) {
    return;
  }
  dispatch(setCategory(res.data.data));
  dispatch(categorySetTotalPage(res.data.totalPage));
};

export const getPublisher = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/publisher/all/${
        getState().bookReducers.publisher.page
      }`
    );
  } catch (err) {
    return;
  }
  dispatch(setPublisher(res.data.data));
  dispatch(publisherSetTotalPage(res.data.totalPage));
};

export const getAuthor = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/author/all/${
        getState().bookReducers.author.page
      }`
    );
  } catch (err) {
    return;
  }
  dispatch(setAuthor(res.data.data));
  dispatch(authorSetTotalPage(res.data.totalPage));
};

export const setCategory = (data) => ({
  type: bookTypes.SET_CATEGORY_BOOK,
  data,
});

export const setPublisher = (data) => ({
  type: bookTypes.SET_PUBLISHSER,
  data,
});

export const setAuthor = (data) => ({
  type: bookTypes.SET_AUTHOR,
  data,
});
export const addCategorySuccess = () => ({
  type: bookTypes.ADD_CATEGORY_SUCCESS,
});
export const addCategotyFail = () => ({
  type: bookTypes.ADD_CATEGORY_FAIL,
});
export const updateCategorySuccess = () => ({
  type: bookTypes.UPDATE_CATEGORY_SUCCESS,
});
export const updateCategoryFail = () => ({
  type: bookTypes.UPDATE_CATEGORY_FAIL,
});
export const resetCategory = () => ({
  type: bookTypes.RESET_CATEGORY,
});

export const getCategoryAll = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.get(`${process.env.REACT_APP_API_URL}/category`);
  } catch (err) {
    return;
  }
  dispatch(setCategory(res.data.data));
};

export const addCategoryBook = (name) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/addcategory", {
      name: name,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    dispatch(addCategotyFail());
    return;
  }

  dispatch(addCategorySuccess());
  dispatch(resetCategory());
  dispatch(getCategoryAll());
};

export const addCategory = (name) => async (dispatch, getState) => {
  dispatch(resetCategory());
  let res;
  try {
    res = await axiosClient.post("/admin/addcategory", {
      name: name,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    dispatch(addCategotyFail());
    return;
  }
  dispatch(addCategorySuccess());
  dispatch(getCategory());
};

export const updateCategory = (id, name) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/updatecategory", {
      id: id,
      name: name,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    dispatch(updateCategoryFail());
    return;
  }
  dispatch(updateCategorySuccess());
  dispatch(getCategory());
};

export const deactivateCategory = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/deactivatecategory/" + id);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    console.log(err);
    return;
  }
  dispatch(getCategory());
};
export const deleteCategory = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/deletecategory/" + id);
    if (res.result === "success") {
      swal("Success!", res.message, "success");
    } else if (res.result === "error") {
      swal("Error!", res.message, "error");
    }
  } catch (err) {
    swal("Error!", res.message, "error");
    return;
  }
  dispatch(getCategory());
};

export const addAuthorSuccess = () => ({
  type: bookTypes.ADD_AUTHOR_SUCCESS,
});
export const addAuthorFail = () => ({
  type: bookTypes.ADD_AUTHOR_FAIL,
});
export const updateAuthorSuccess = () => ({
  type: bookTypes.UPDATE_AUTHOR_SUCCESS,
});
export const updateAuthorFail = () => ({
  type: bookTypes.UPDATE_AUTHOR_FAIL,
});
export const resetAuthor = () => ({
  type: bookTypes.RESET_AUTHOR,
});

export const getAuthorAll = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.get(`${process.env.REACT_APP_API_URL}/author`);
  } catch (err) {
    return;
  }
  dispatch(setAuthor(res.data.data));
};
export const addAuthorBook = (name) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/addauthor", {
      name: name,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    dispatch(addAuthorFail());
    return;
  }

  dispatch(addAuthorSuccess());
  dispatch(resetAuthor());
  dispatch(getAuthorAll());
};

export const addAuthor = (name) => async (dispatch, getState) => {
  dispatch(resetAuthor());
  let res;
  try {
    res = await axiosClient.post("/admin/addauthor", {
      name: name,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    dispatch(addAuthorFail());
    return;
  }
  dispatch(addAuthorSuccess());
  dispatch(getAuthor());
};

export const updateAuthor = (id, name) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/updateauthor", {
      id: id,
      name: name,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    dispatch(updateAuthorFail());
    return;
  }
  dispatch(updateAuthorSuccess());
  dispatch(getAuthor());
};

export const deactivateAuthor = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.get("/admin/deactivateauthor/" + id);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    console.log(err);
    return;
  }
  dispatch(getAuthor());
};
export const deleteAuthor = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/deleteauthor/" + id);

    if (res.result === "success") {
      swal("Success!", res.message, "success");
    } else if (res.result === "error") {
      swal("Error!", res.message, "error");
    }
  } catch (err) {
    swal("Error!", res.message, "error");
    return;
  }
  dispatch(getAuthor());
};

export const uploadFile = (file) => async (dispatch, getState) => {
  console.log(file);
  let data = new FormData();
  data.append("file", file);
  let res;
  try {
    res = await axiosClient.post("/admin/upload", data);
    console.log(res);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    console.log(res);
    toast.error(res.message);
    // dispatch(updateBookFail());
    // dispatch(resetBook());
    return;
  }
  // dispatch(updateBookSuccess());
  // dispatch(resetBook());
  dispatch(getAuthor());
};
export const downloadFile = () => async (dispatch, getState) => {
  // axiosClient.get("/admin/download");
  fetch("http://localhost:8090/admin/download", {
    method: "GET",
  })
    .then((response) => response.blob())
    .then((blob) => {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "author.xlsx";
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove(); //afterwards we remove the element again
    });
};
// let res;
// try {
//   res = await axiosClient.get("/admin/download");
//   console.log(res);
//   // if (res.success) toast.success(res.message);
//   // else toast.error(res.message);
// } catch (err) {
//   console.log(res);
//   // toast.error(res.message);
//   // dispatch(updateBookFail());
//   // dispatch(resetBook());
//   return;
// }
// dispatch(updateBookSuccess());
// dispatch(resetBook());
// dispatch(getAuthor());

export const addPublisherSuccess = () => ({
  type: bookTypes.ADD_PUBLISHER_SUCCESS,
});
export const addPublisherFail = () => ({
  type: bookTypes.ADD_PUBLISHER_FAIL,
});
export const updatePublisherSuccess = () => ({
  type: bookTypes.UPDATE_PUBLISHER_SUCCESS,
});
export const updatePublisherFail = () => ({
  type: bookTypes.UPDATE_PUBLISHER_FAIL,
});
export const resetPublisher = () => ({
  type: bookTypes.RESET_PUBLISHER,
});

export const getPublisherAll = () => async (dispatch, getState) => {
  let res;
  try {
    res = await axios.get(`${process.env.REACT_APP_API_URL}/publisher`);
  } catch (err) {
    return;
  }
  dispatch(setPublisher(res.data.data));
};

export const addPublisherBook = (name) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/addpublisher", {
      name: name,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    dispatch(addPublisherFail());
    return;
  }

  dispatch(addPublisherSuccess());
  dispatch(resetPublisher());
  dispatch(getPublisherAll());
};

export const addPublisher = (name) => async (dispatch, getState) => {
  dispatch(resetPublisher());
  let res;
  try {
    res = await axiosClient.post("/admin/addpublisher", {
      name: name,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    dispatch(addPublisherFail());
    return;
  }
  dispatch(addPublisherSuccess());
  dispatch(getPublisher());
};

export const updatePublisher = (id, name) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/updatepublisher", {
      id: id,
      name: name,
    });
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    dispatch(updatePublisherFail());
    return;
  }
  dispatch(updatePublisherSuccess());
  dispatch(getPublisher());
};

export const deactivatePublisher = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/deactivatepublisher/" + id);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    console.log(err);
    return;
  }
  dispatch(getPublisher());
};
export const deletePublisher = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.post("/admin/deletepublisher/" + id);
    if (res.result === "success") {
      swal("Success!", res.message, "success");
    } else if (res.result === "error") {
      swal("Error!", res.message, "error");
    }
  } catch (err) {
    swal("Error!", res.message, "error");
    return;
  }
  dispatch(getPublisher());
};

export const backPage = () => (dispatch, getState) => {
  let page = getState().bookReducers.book.page;
  if (page > 1) {
    dispatch(setPage(parseInt(page) - 1));
  }
};

export const nextPage = () => (dispatch, getState) => {
  let page = getState().bookReducers.author.page;
  let totalpage = getState().bookReducers.author.totalpage;
  if (page < totalpage) {
    dispatch(setPage(parseInt(page) + 1));
  }
};
export const authorBackPage = () => (dispatch, getState) => {
  let page = getState().bookReducers.book.page;
  if (page > 1) {
    dispatch(authorSetPage(parseInt(page) - 1));
  }
};

export const authorNextPage = () => (dispatch, getState) => {
  let page = getState().bookReducers.author.page;
  let totalpage = getState().bookReducers.author.totalpage;
  if (page < totalpage) {
    dispatch(authorSetPage(parseInt(page) + 1));
  }
};
export const categoryBackPage = () => (dispatch, getState) => {
  let page = getState().bookReducers.category.page;
  if (page > 1) {
    dispatch(categorySetPage(parseInt(page) - 1));
  }
};

export const categoryNextPage = () => (dispatch, getState) => {
  let page = getState().bookReducers.category.page;
  let totalpage = getState().bookReducers.category.totalpage;
  if (page < totalpage) {
    dispatch(categorySetPage(parseInt(page) + 1));
  }
};
export const publisherBackPage = () => (dispatch, getState) => {
  let page = getState().bookReducers.publisher.page;
  if (page > 1) {
    dispatch(publisherSetPage(parseInt(page) - 1));
  }
};

export const publisherNextPage = () => (dispatch, getState) => {
  let page = getState().bookReducers.publisher.page;
  let totalpage = getState().bookReducers.publisher.totalpage;
  if (page < totalpage) {
    dispatch(publisherSetPage(parseInt(page) + 1));
  }
};
export const billBackPage = () => (dispatch, getState) => {
  let page = getState().bookReducers.bill.page;
  if (page > 1) {
    dispatch(billSetPage(parseInt(page) - 1));
  }
};

export const billNextPage = () => (dispatch, getState) => {
  let page = getState().bookReducers.bill.page;
  let totalpage = getState().bookReducers.bill.totalpage;
  if (page < totalpage) {
    dispatch(billSetPage(parseInt(page) + 1));
  }
};
export const addBookSuccess = () => ({
  type: bookTypes.ADD_BOOK_SUCCESS,
});
export const addBookFail = () => ({
  type: bookTypes.ADD_BOOK_FAIL,
});
export const updateBookSuccess = () => ({
  type: bookTypes.UPDATE_BOOK_SUCCESS,
});
export const updateBookFail = () => ({
  type: bookTypes.UPDATE_BOOK_FAIL,
});

export const resetBook = () => ({
  type: productTypes.RESET_BOOK_DETAIL,
});

export const addBook =
  (
    id_category,
    name,
    price,
    quantity,
    published,
    createdAt,
    describe,
    id_nsx,
    id_author,
    file
  ) =>
  async (dispatch, getState) => {
    let data = new FormData();
    data.append("file", file);
    data.append("id_category", id_category);
    data.append("name", name);
    data.append("price", price);
    data.append("quantity", quantity);
    data.append("published", published);
    data.append("createdAt", createdAt);
    data.append("describe", describe);
    data.append("id_nsx", id_nsx);
    data.append("id_author", id_author);
    let res;
    try {
      res = await axiosClient.post("/admin/addbook", data);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    } catch (err) {
      toast.error(res.message);
      dispatch(addBookFail());
      dispatch(resetBook());
      return;
    }
    dispatch(addBookSuccess());
    dispatch(resetBook());
    dispatch(getBook());
  };
export const updateBook =
  (
    id,
    name,
    id_category,
    price,
    quantity,
    published,
    createdAt,
    describe,
    id_nsx,
    id_author,
    file
  ) =>
  async (dispatch, getState) => {
    let data = new FormData();
    data.append("file", file);
    data.append("id", id);
    data.append("id_category", id_category);
    data.append("name", name);
    data.append("price", price);
    data.append("quantity", quantity);
    data.append("published", published);
    data.append("createdAt", createdAt);
    data.append("describe", describe);
    data.append("id_nsx", id_nsx);
    data.append("id_author", id_author);
    let res;
    try {
      res = await axiosClient.post("/admin/updatebook", data);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    } catch (err) {
      toast.error(res.message);
      dispatch(updateBookFail());
      dispatch(resetBook());
      return;
    }
    dispatch(updateBookSuccess());
    dispatch(resetBook());
    dispatch(getBook());
  };

export const uploadBookFile = (file) => async (dispatch, getState) => {
  // console.log(file);

  let data = new FormData();
  data.append("file", file);
  let res;

  try {
    res = await axiosClient.post("/admin/uploadBook", data);
    // console.log(res);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    // console.log(res);
    toast.error(res.message);
    // dispatch(updateBookFail());
    // dispatch(resetBook());
    return;
  }

  // dispatch(updateBookSuccess());
  // dispatch(resetBook());
  dispatch(getBook());
};

export const downloadBookFile = () => async (dispatch, getState) => {
  // axiosClient.get("/admin/download");

  fetch("http://localhost:8090/admin/downloadBook", {
    method: "GET",
  })
    .then((response) => response.blob())
    .then((blob) => {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "book.xlsx";
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove(); //afterwards we remove the element again
    });
};

export const setBill = (data) => ({
  type: bookTypes.BILL_SET_DATA,
  data,
});
export const billSetPage = (page) => ({
  type: bookTypes.BILL_SET_PAGE,
  page,
});
export const billSetTotalPage = (totalpage) => ({
  type: bookTypes.BILL_SET_TOTAL_PAGE,
  totalpage,
});
export const getBill = (status) => async (dispatch, getState) => {
  let link = "/bill/status/true";
  if (status === "false") {
    link = "/bill/status/false";
  }
  let res = null;
  try {
    res = await axiosClient.get(link);
  } catch (err) {
    return;
  }
  dispatch(setBill(res.data));
  dispatch(billSetTotalPage(res.totalPage));
};

export const deleteBill = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.get("/bill/delete/" + id);
    if (res.result === "success") {
      swal("Success!", res.message, "success");
    } else if (res.result === "error") {
      swal("Error!", res.message, "error");
    }
  } catch (err) {
    swal("Error!", res.message, "error");
    console.log(err);
    return;
  }
  dispatch(getBill());
};
export const deactivateBill = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.get("/bill/deactivate/" + id);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    console.log(err);
    return;
  }
  dispatch(getBill());
};
export const deliverBill = (id) => async (dispatch, getState) => {
  let res;
  try {
    res = await axiosClient.put("/bill/deliver/" + id);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  } catch (err) {
    toast.error(res.message);
    console.log(err);
    return;
  }
  dispatch(getBill());
};
