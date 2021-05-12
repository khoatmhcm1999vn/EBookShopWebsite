import React, { useState, useEffect } from "react";
// import * as bookActions from "../../actions/bookActions";
// import { useSelector, useDispatch } from "react-redux";

// import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

import swal from "sweetalert";
import Table from "../../components/table/Table";
// import { getToken, getUser } from "../../config/store.config";
import Loading from "../../components/loading/loading";
// import * as moment from "moment";
import "./BookScreen.css";
// import { SubRowAsync } from "../../components/table/Table";
// import makeData from "../BookScreen/makeData";
// import Axios from "axios";

import {
  NumberRangeColumnFilter,
  SliderColumnFilter,
  SelectColumnFilter,
  filterGreaterThan,
} from "../../components/table/Table";

export default function BookScreen(props) {
  // const [book, setBook] = useState(null);

  const [file, setFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const [curr, setCurr] = useState("add");
  const [category, setCategory] = useState("category");
  const [publisher, setPublisher] = useState("publisher");
  const [author, setAuthor] = useState("author");
  const [name, setName] = useState("");
  const [createdAt, setCreatedAt] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [published, setPublished] = useState(true);
  const [img, setImg] = useState("");
  const [describe, setDescribe] = useState("");

  const [id_nsx, setId_Nsx] = useState("");
  const [id_author, setId_Author] = useState("");
  const [id_category, setId_Category] = useState("");

  const [noti, setNoti] = useState("");
  const [id, setId] = useState(null);

  const [show, setShow] = useState(false);
  const [nameAuthor, setNameAuthor] = useState("");

  const [nameCategory, setNameCategory] = useState("");
  const [showCategory, setShowCategory] = useState(false);

  const [namePublisher, setNamePublisher] = useState("");
  const [showPublisher, setShowPublisher] = useState(false);

  const [showImport, setShowImport] = useState(false);
  const [fileExcel, setFileExcel] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleImportClose = () => setShowImport(false);
  const handleImportShow = () => setShowImport(true);

  useEffect(() => {
    // console.log("Prop Received: ", props.mproductDetail);
    if (props.book !== null) {
      setImagePreviewUrl(props.book.img);
    }
    if (props.isadd === true) {
      reset();
    }
    if (props.isupdate === true) {
      reset();
    }
    if (props.mproductDetail !== null) {
      setCurr("update");
      setName(props.mproductDetail.name);
      setCreatedAt(props.mproductDetail.createdAt.slice(0, 10));
      setPrice(props.mproductDetail.price);
      setQuantity(props.mproductDetail.quantity);
      setPublished(props.mproductDetail.published);
      setDescribe(props.mproductDetail.describe);
      setCategory(getNameCategoryByID(props.mproductDetail.id_category));
      setId_Category(props.mproductDetail.id_category);
      setId_Author(props.mproductDetail.id_author);
      setAuthor(getNameAuthorByID(props.mproductDetail.id_author));
      setId_Nsx(props.mproductDetail.id_nsx);
      setPublisher(getNamePublisherByID(props.mproductDetail.id_nsx));
      setImg(props.mproductDetail.img);
      setId(props.mproductDetail._id);
    }
    // if (props.isaddAuthor === true) reset();
  }, [
    props.book,
    props.isadd,
    props.isupdate,
    props.mproductDetail,
    props.author,
    // props.isaddAuthor,
  ]);

  const handleId = async (value) => {
    await props.getProductDetail(value);
  };
  // console.log(curr);

  const handleAddAuthor = () => {
    setShow(false);
    props.addAuthor(nameAuthor);
  };

  const handleAddCategory = () => {
    setShowCategory(false);
    props.addCategory(nameCategory);
  };

  const handleAddPublisher = () => {
    setShowPublisher(false);
    props.addPublisher(namePublisher);
  };

  const handleChangeExcel = (file) => {
    // console.log(img);
    if (file === undefined) return;
    setFileExcel(file);
  };

  const handleUploadExcel = () => {
    setShowImport(false);
    props.uploadFile(fileExcel);
  };

  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? "👇" : "👉"}
          </span>
        ),
        // We can override the cell renderer with a SubCell to be used with an expanded row
        SubCell: () => null, // No expander on an expanded row
      },
      {
        Header: "Front Image",
        accessor: "img",
        Cell: ({ cell: { value } }) => (
          <img class="img-fluid img-rounded" width={200} src={value} alt="a" />
        ),
      },
      {
        Header: "Name",
        accessor: "name", // accessor is the "key" in the data
        aggregate: "count",
        Aggregated: ({ value }) => `${value} Names`,
      },
      {
        Header: "Description",
        accessor: "describe",
      },
      {
        Header: "Category Name",
        accessor: "cate_name",
        Filter: SelectColumnFilter,
        filter: "includes",
        aggregate: "count",
        Aggregated: ({ value }) => `${value} Names`,
      },
      {
        Header: "Published",
        accessor: "convertedZipCode",
        Filter: SelectColumnFilter,
        filter: "includes",
        Cell: ({ cell: { value } }) => {
          switch (value) {
            case "true":
              return (
                <div
                  className="transaction-status"
                  style={{ background: "green" }}
                ></div>
              );
            case "false":
              return (
                <div
                  className="transaction-status"
                  style={{ background: "red" }}
                ></div>
              );
            default:
              return (
                <div
                  className="transaction-status"
                  style={{ background: "yellow" }}
                ></div>
              );
          }
        },
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        Filter: SliderColumnFilter,
        filter: filterGreaterThan,
        aggregate: "average",
        Aggregated: ({ value }) => `${Math.round(value * 100) / 100} (avg)`,
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () => info.rows.reduce((sum, row) => row.values.quantity + sum, 0),
            [info.rows]
          );
          return <>Total: {total}</>;
        },
      },
      {
        Header: "Price",
        accessor: "price",
        Filter: NumberRangeColumnFilter,
        filter: "between",
        aggregate: "sum",
        Aggregated: ({ value }) => `${value} (total)`,
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          let date = new Date(value).toDateString();
          // console.log(date);
          // return new Date(value).toLocaleDateString();
          let day = date.split(" ")["2"];
          let month = date.split(" ")["1"];
          if (day.charAt(0) === "0") {
            day = day.charAt(1);
          }
          return day + " " + month;
        },
        filter: "dateFilter",
        // Filter: DateRangeColumnFilter,
        // filter: "dateBetween" /* Custom Filter Type */,
      },
      {
        Header: "Action",
        accessor: "_id",
        Cell: ({ cell: { value } }) => {
          return (
            <>
              <div className="btn-group">
                <button
                  onClick={async () => {
                    await handleId(value);
                    // setCurr("update");
                    // setName(props.mproductDetail.name);
                    // setCreatedAt(productDetail.createdAt.slice(0, 10));
                    // setPrice(productDetail.price);
                    // setQuantity(productDetail.quantity);
                    // setPublished(productDetail.published);
                    // setDescribe(productDetail.describe);
                    // setCategory(getNameCategoryByID(productDetail.id_category));
                    // setId_Category(productDetail.id_category);
                    // setId_Author(productDetail.id_author);
                    // setAuthor(getNameAuthorByID(productDetail.id_author));
                    // setId_Nsx(productDetail.id_nsx);
                    // setPublisher(getNamePublisherByID(productDetail.id_nsx));
                    // setImg(productDetail.img);
                    // setId(value);
                  }}
                  className="btn btn-success"
                >
                  <i className="icon_check_alt2" />
                </button>
                <button
                  onClick={() => confirmDelete(value)}
                  className="btn btn-danger"
                >
                  <i className="icon_close_alt2" />
                </button>
                <button
                  onClick={() => props.deactivateBook(value)}
                  className="btn btn-danger"
                >
                  <i className="icon_close_alt2" />
                </button>
              </div>

              {/* <Link
                to={"/book/update/" + value}
                type="button"
                class="btn btn-primary"
                style={{ marginRight: "5px" }}
                onClick={() => dispatch(bookActions.clearState())}
              >
                Edit
              </Link>
              <button
                onClick={() =>
                  dispatch(bookActions.Remove(value, props.history))
                }
                className="btn btn-danger"
              >
                <i className="icon_close_alt2" />
              </button> */}
            </>
          );
        },
      },
    ],
    []
  );
  const Holdon = (columns) => {
    if (props.book) {
      return (
        <Table
          columns={columns}
          data={props.book}
          parent_action={props.bookActions}
          // fetchData={retrieveProducts}
          // loading={loading}
          // pageCount={pageCount}
          // updateMyData={updateMyData}
          // skipPageReset={skipPageReset}
          // renderRowSubComponent={renderRowSubComponent}
        />
      );
    } else {
      return <Loading />;
    }
  };

  const handleChangeImg = (img) => {
    if (img === undefined) return;
    let reader = new FileReader();
    reader.onloadend = () => {
      setFile(img);
      setImg(reader.result);
    };
    reader.readAsDataURL(img);
  };

  const invalidPrice = (t) => {
    console.log(t);

    var str = t.toString();
    let count = 0;

    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) == "+" || str.charAt(i) == "-") count++;
      else break;
    }

    str = str.substring(count, str.length);
    console.log(str);
    count = 0;

    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) == ".") {
        count++;
      }
      if (str.charAt(i) < "0" || str.charAt(i) > "9") return false;
    }

    if (count > 1) return false;
    return !isNaN(Number.parseFloat(str));
  };

  const submitAddBook = () => {
    // const {
    //   id_category,
    //   name,
    //   price,
    //   quantity,
    //   published,
    //   createdAt,
    //   describe,
    //   id_nsx,
    //   id_author,
    //   file,
    // } = this.state;
    if (name.length <= 0) {
      setNoti({ noti: "Name Invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (createdAt === null) {
      setNoti({ noti: "Day invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (!invalidPrice(price)) {
      setNoti({ noti: "Price invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (!invalidPrice(quantity)) {
      setNoti({ noti: "Quantity invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (id_category === "") {
      setNoti({ noti: "Category invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (id_author === "") {
      setNoti({ noti: "Author invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (id_nsx === "") {
      setNoti({ noti: "Publisher invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (file === null) {
      setNoti({ noti: "File invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    props.addBook(
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
    );
  };

  const submitUpdateBook = () => {
    if (name.length <= 0) {
      setNoti({ noti: "Name invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (createdAt === null) {
      setNoti({ noti: "Day invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (!invalidPrice(price)) {
      setNoti({ noti: "Price invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (!invalidPrice(quantity)) {
      setNoti({ noti: "Quantity invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (id_category === "") {
      setNoti({ noti: "Category invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (id_author === "") {
      setNoti({ noti: "Author invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (id_nsx === "") {
      setNoti({ noti: "Publisher invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    if (file === null && img === "") {
      setNoti({ noti: "File invalid" });
      return;
    } else {
      setNoti({ noti: "" });
    }
    props.updateBook(
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
    );
    reset();
  };

  const reset = () => {
    setNameAuthor("");
    setShow(false);
    setNameCategory("");
    setShowCategory(false);
    setNamePublisher("");
    setShowPublisher(false);
    setShowImport(false);

    setNoti("");
    setName("");
    setFile(null);
    setImagePreviewUrl(null);
    setCurr("add");
    setCategory("category");
    setPublisher("publisher");
    setAuthor("author");
    setCreatedAt(null);
    setPrice("");
    setQuantity("");
    setPublished(true);
    setImg("");
    setDescribe("");
    setId_Nsx("");
    setId_Author("");
    setId_Category("");
    setId(null);
  };

  const renderBtnSubmit = () => {
    if (curr === "add") {
      return (
        <div className="form-group">
          <div className="col-lg-offset-2 col-lg-10">
            <button
              onClick={() => submitAddBook()}
              className="btn-custom"
              type="submit"
            >
              Add
            </button>
            <button className="btn-custom" disabled type="button">
              Update
            </button>
            <button className="btn-custom" onClick={() => reset()}>
              Reset
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-group">
          <div className="col-lg-offset-2 col-lg-10">
            <button className="btn-custom" disabled type="submit">
              Add
            </button>
            <button
              className="btn-custom"
              onClick={() => submitUpdateBook()}
              type="button"
            >
              Update
            </button>
            <button className="btn-custom" onClick={() => reset()}>
              Reset
            </button>
          </div>
        </div>
      );
    }
  };

  const renderMenuCategory = () => {
    if (props.category) {
      return props.category.map((element, index) => {
        return (
          <li
            onClick={() => {
              setCategory(element.name);
              setId_Category(element._id);
            }}
          >
            <a>{element.name}</a>
          </li>
        );
      });
    } else {
      return null;
    }
  };
  const renderMenuAuthor = () => {
    if (props.author) {
      return props.author.map((element, index) => {
        return (
          <li
            onClick={() => {
              setAuthor(element.name);
              setId_Author(element._id);
            }}
          >
            <a>{element.name}</a>
          </li>
        );
      });
    } else {
      return null;
    }
  };
  const renderMenuPublisher = () => {
    if (props.publisher) {
      return props.publisher.map((element, index) => {
        return (
          <li
            onClick={() => {
              setPublisher(element.name);
              setId_Nsx(element._id);
            }}
          >
            <a>{element.name}</a>
          </li>
        );
      });
    } else {
      return null;
    }
  };
  const getNameCategoryByID = (id) => {
    for (let i = 0; i < props.category.length; i++) {
      if (id === props.category[i]._id) return props.category[i].name;
    }
  };
  const getNameAuthorByID = (id) => {
    for (let i = 0; i < props.author.length; i++) {
      if (id === props.author[i]._id) return props.author[i].name;
    }
  };
  const getNamePublisherByID = (id) => {
    for (let i = 0; i < props.publisher.length; i++) {
      // console.log(id + " === " + props.publisher[i]._id);
      if (id === props.publisher[i]._id) return props.publisher[i].name;
    }
  };

  const handleCheckBox = (e) => {
    setPublished(e.target.checked);
  };

  const confirmDelete = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        props.deleteBook(id);
        swal("Poof! Your Book data has been deleted!", {
          icon: "success",
        });
      }
    });
  };

  // console.log(published);

  // const bookReducer = useSelector(({ book }) => book);
  // const dispatch = useDispatch();

  // const [skipPageReset, setSkipPageReset] = React.useState(false);

  // const updateMyData = (rowIndex, columnId, value) => {
  //   // We also turn on the flag to not reset the page
  //   setSkipPageReset(true);
  //   let values = { _id: rowIndex, column: columnId, value: value };
  //   dispatch(bookActions.inline_update(values));
  // };

  // const [data, setData] = useState([]);
  // const [searchName, setSearchName] = useState("");
  // const [loading, setLoading] = React.useState(false);
  // const [pageCount, setPageCount] = React.useState(0);

  // const getAll = (params) => {
  //   return Axios.post("http://localhost:8090/api/getAllBook", { params });
  // };

  // console.log(data);

  // const retrieveProducts = React.useCallback(({ pageIndex, pageSize }) => {
  //   // const params = getRequestParams(searchName, pageIndex, pageSize);
  //   // console.log(params);
  //   setLoading(true);
  //   let params = {};
  //   params["page"] = pageIndex + 1;
  //   params["size"] = pageSize;
  //   console.log(pageIndex);
  //   console.log(pageSize);
  //   console.log(params);
  //   getAll(params)
  //     .then((response) => {
  //       if (response.error) {
  //         // setError(response.error);
  //       }
  //       const { data, pageSizex2 } = response.data;
  //       const startRow = pageSize * pageIndex;
  //       const endRow = startRow + pageSize;
  //       setData(data.slice(startRow, endRow));
  //       // setData(data);
  //       setPageCount(pageSizex2);
  //       setLoading(false);
  //       console.log(params);
  //       console.log(response.data);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });

  // setTimeout(() => {
  //   // Only update the data if this is the latest fetch
  //   if (fetchId === fetchIdRef.current) {
  //     const startRow = pageSize * pageIndex;
  //     const endRow = startRow + pageSize;
  //     setData(serverData.slice(startRow, endRow));
  //     // Your server could send back total page count.
  //     // For now we'll just fake it, too
  //     setPageCount(Math.ceil(serverData.length / pageSize));
  //     setLoading(false);
  //   }
  // }, 1000);
  //  }, []);

  // const retrieveProducts = () => {
  //   const params = getRequestParams(searchName, page, pageSize);
  //   getAll(params)
  //     .then((response) => {
  //       if (response.error) {
  //         setError(response.error);
  //       }
  //       const { products, totalPages } = response.data;
  //       setLoading(false);
  //       setProducts(products);
  //       setCount(totalPages);
  //       console.log(response.data);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  // useEffect(retrieveProducts, [retrieveProducts]);

  // useEffect(() => {
  //   if (getToken() === null) {
  //     return props.history.push("/login_register");
  //   }
  //   dispatch(bookActions.Index());
  // }, [dispatch, props.history]);

  // useEffect(() => {
  //   // setSkipPageReset(false);
  //   setData(bookReducer.result);
  // }, [bookReducer.result]);

  // console.log(bookReducer);

  // const onChangeSearchName = (e) => {
  //   const searchName = e.target.value;
  //   setSearchName(searchName);
  //   // setError(false);
  //   // setLoading(false);
  // };

  // const getRequestParams = (searchName, page, pageSize) => {
  //   let params = {};
  //   if (searchName) {
  //     params["name"] = searchName;
  //   }
  //   if (page) {
  //     params["pageIndex"] = page - 1;
  //   }
  //   if (pageSize) {
  //     params["pageSize"] = pageSize;
  //   }
  //   return params;
  // };

  // const retrieveProducts = () => {
  //   const params = getRequestParams(searchName);
  //   dispatch(bookActions.SearchName(params));
  // };

  // function confirmDelete(id, history) {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Once deleted, you will not be able to recover this data!",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       dispatch(bookActions.Remove(id, history));
  //       swal("Poof! Your Book data has been deleted!", {
  //         icon: "success",
  //       });
  //     }
  //   });
  // }

  // const getTotal = () => {
  //   // const a = JSON.stringify(branchReducer.result)
  //   console.log(branchReducer.result);
  //   // return branchReducer.result.reduce((cur, next) => {
  //   //   return (cur + next.quantity);
  //   // }, 0);
  //   // return products.reduce((currentValue, nextValue) => {
  //   //   return Math.round(currentValue + nextValue.count * nextValue.price);
  //   // }, 0);
  // };

  // const data = React.useMemo(() => makeData(10), []);
  // const renderRowSubComponent = React.useCallback(
  //   ({ row, rowProps, visibleColumns }) => (
  //     <SubRowAsync
  //       row={row}
  //       rowProps={rowProps}
  //       visibleColumns={visibleColumns}
  //     />
  //   ),
  //   []
  // );
  // const loadData = () => dispatch(bookActions.Index());

  return (
    <section id="main-content">
      <div className="row">
        <div className="col-lg-12">
          <h3 className="page-header">
            <i className="fa fa-table" /> Table
          </h3>
          <ol className="breadcrumb">
            <li>
              <i className="fa fa-home" />
              <a href="/dashboard">Home</a>
            </li>
            <li>
              <i className="fa fa-table" />
              Table
            </li>
            <li>
              <i className="fa fa-th-list" />
              Book Manager
            </li>
          </ol>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <section className="panel">
            <header className="panel-heading">Advanced Table</header>
            <div className="card card-body">{Holdon(columns)}</div>

            {/* {props.book.map((element, index) => {
              return (
                <td>
                  <div className="btn-group">
                    <button
                      onClick={() => {
                        setCurr("update");
                        setName(element.name);
                        setCreatedAt(element.createdAt.slice(0, 10));
                        setPrice(element.price);
                        setQuantity(element.quantity);
                        setPublished(element.published);
                        setDescribe(element.describe);
                        setCategory(getNameCategoryByID(element.id_category));
                        setId_Category(element.id_category);
                        setId_Author(element.id_author);
                        setAuthor(getNameAuthorByID(element.id_author));
                        setId_Nsx(element.id_nsx);
                        setPublisher(getNamePublisherByID(element.id_nsx));
                        setImg(element.img);
                        setId(element._id);
                      }}
                      className="btn btn-success"
                    >
                      <i className="icon_check_alt2" />
                    </button>
                    <button
                      onClick={() => confirmDelete(element._id)}
                      className="btn btn-danger"
                    >
                      <i className="icon_close_alt2" />
                    </button>
                    <button
                      onClick={() => props.deactivateBook(element._id)}
                      className="btn btn-danger"
                    >
                      <i className="icon_close_alt2" />
                    </button>
                  </div>
                </td>
              );
            })}
            <table className="table table-striped table-advance table-hover">
              <tbody>
                <tr>
                  <th>
                    <i className="icon_profile" /> Name
                  </th>
                  <th>
                    <i className="icon_profile" /> Published
                  </th>
                  <th>
                    <i className="icon_calendar" /> Date
                  </th>
                  <th>
                    <i className="icon_profile" /> Price
                  </th>
                  <th>
                    <i className="icon_profile" /> Quantity
                  </th>
                  <th>
                    <i className="icon_profile" /> Description
                  </th>
                  <th>
                    <i className="icon_cogs" /> Action
                  </th>
                </tr>
                {props.book.map((element, index) => {
                  return (
                    <tr>
                      <td>{element.name}</td>
                      <td>{element.published.toString()}</td>
                      <td>
                        {new Date(element.createdAt).toLocaleDateString()}
                      </td>
                      <td>{element.price}</td>
                      <td>{element.quantity}</td>
                      <td style={{ width: "40%" }}>{element.describe}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            onClick={() => {
                              setCurr("update");
                              setName(element.name);
                              setCreatedAt(element.createdAt.slice(0, 10));
                              setPrice(element.price);
                              setQuantity(element.quantity);
                              setPublished(element.published);
                              setDescribe(element.describe);
                              setCategory(
                                getNameCategoryByID(element.id_category)
                              );
                              setId_Category(element.id_category);
                              setId_Author(element.id_author);
                              setAuthor(getNameAuthorByID(element.id_author));
                              setId_Nsx(element.id_nsx);
                              setPublisher(
                                getNamePublisherByID(element.id_nsx)
                              );
                              setImg(element.img);
                              setId(element._id);
                            }}
                            className="btn btn-success"
                          >
                            <i className="icon_check_alt2" />
                          </button>
                          <button
                            onClick={() => confirmDelete(element._id)}
                            className="btn btn-danger"
                          >
                            <i className="icon_close_alt2" />
                          </button>
                          <button
                            onClick={() => props.deactivateBook(element._id)}
                            className="btn btn-danger"
                          >
                            <i className="icon_close_alt2" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {renderPagination()} */}
          </section>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <section className="panel">
            <header className="panel-heading">Form validations</header>
            <div className="panel-body">
              <div className="form" id="from-book">
                <div
                  className="form-validate form-horizontal"
                  id="feedback_form"
                  method="get"
                  action=""
                >
                  <div className="form-group ">
                    <label for="cname" className="control-label col-lg-2">
                      Name <span className="required">*</span>
                    </label>
                    <div className="col-lg-10">
                      <input
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        value={name}
                        className="form-control"
                        id="cname"
                        name="fullname"
                        minlength="5"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group ">
                    <label for="cemail" className="control-label col-lg-2">
                      Date<span className="required">*</span>
                    </label>
                    <div className="col-lg-10">
                      <input
                        value={createdAt}
                        onChange={(e) => setCreatedAt(e.target.value)}
                        className="form-control "
                        id="cemail"
                        type="date"
                        name="email"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group ">
                    <label for="curl" className="control-label col-lg-2">
                      Price
                    </label>
                    <div className="col-lg-10">
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="form-control "
                        id="curl"
                        type="text"
                        name="url"
                      />
                    </div>
                  </div>
                  <div className="form-group ">
                    <label for="curl" className="control-label col-lg-2">
                      Quantity
                    </label>
                    <div className="col-lg-10">
                      <input
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="form-control "
                        id="curl"
                        type="text"
                        name="url"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="curl" className="control-label col-lg-2">
                      Published
                    </label>
                    <input
                      type="checkbox"
                      onChange={handleCheckBox}
                      checked={published}
                      value={published}
                    />
                  </div>
                  <div className="form-group ">
                    <label for="cname" className="control-label col-lg-2">
                      Describe <span className="required">*</span>
                    </label>
                    <div className="col-lg-10">
                      <textarea
                        value={describe}
                        onChange={(e) => setDescribe(e.target.value)}
                        className="form-control"
                        id="subject"
                        name="subject"
                        minlength="5"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group ">
                    <label for="comment " className="control-label col-lg-2">
                      Category
                    </label>
                    <div className="btn-group col-lg-10">
                      <button
                        style={{ width: "200px" }}
                        type="button"
                        className="btn btn-default dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        {category} <span className="caret" />
                      </button>
                      <ul className="dropdown-menu" role="menu">
                        {renderMenuCategory()}
                      </ul>

                      <div className="form-group">
                        <button
                          onClick={() => setShowCategory(true)}
                          className="btn-custom"
                        >
                          +
                        </button>
                      </div>
                      <Modal
                        show={showCategory}
                        onHide={() => setShowCategory(false)}
                        animation={false}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">
                            Add New Category
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="form-group ">
                            <label
                              for="cname"
                              className="control-label col-lg-2"
                            >
                              Name <span className="required">*</span>
                            </label>
                            <div className="col-lg-10">
                              <input
                                onChange={(e) =>
                                  setNameCategory(e.target.value)
                                }
                                value={nameCategory}
                                className="form-control"
                                id="cname"
                                name="fullname"
                                minlength="5"
                                type="text"
                                required
                              />
                            </div>
                            <button
                              onClick={handleAddCategory}
                              className="btn-custom"
                            >
                              Submit
                            </button>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => setShowCategory(false)}
                          >
                            Close
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => setShowCategory(false)}
                          >
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>

                  <div className="form-group ">
                    <label for="comment" className="control-label col-lg-2">
                      Author
                    </label>
                    <div className="btn-group col-lg-10">
                      <button
                        style={{ width: "200px" }}
                        type="button"
                        className="btn btn-default dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        {author} <span className="caret" />
                      </button>
                      <ul className="dropdown-menu" role="menu">
                        {renderMenuAuthor()}
                      </ul>

                      <div className="form-group">
                        <button onClick={handleShow} className="btn-custom">
                          +
                        </button>
                      </div>
                      <Modal
                        show={show}
                        onHide={handleClose}
                        animation={false}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">
                            Add New Author
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="form-group ">
                            <label
                              for="cname"
                              className="control-label col-lg-2"
                            >
                              Name <span className="required">*</span>
                            </label>
                            <div className="col-lg-10">
                              <input
                                onChange={(e) => setNameAuthor(e.target.value)}
                                value={nameAuthor}
                                className="form-control"
                                id="cname"
                                name="fullname"
                                minlength="5"
                                type="text"
                                required
                              />
                            </div>
                            <button
                              onClick={handleAddAuthor}
                              className="btn-custom"
                            >
                              Submit
                            </button>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={handleClose}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>

                  <div className="form-group ">
                    <label for="comment" className="control-label col-lg-2">
                      Publisher
                    </label>
                    <div className="btn-group col-lg-10">
                      <button
                        type="button"
                        className="btn btn-default dropdown-toggle"
                        data-toggle="dropdown"
                        style={{ width: "200px" }}
                      >
                        {publisher} <span className="caret" />
                      </button>
                      <ul className="dropdown-menu" role="menu">
                        {renderMenuPublisher()}
                      </ul>

                      <div className="form-group">
                        <button
                          onClick={() => setShowPublisher(true)}
                          className="btn-custom"
                        >
                          +
                        </button>
                      </div>
                      <Modal
                        show={showPublisher}
                        onHide={() => setShowPublisher(false)}
                        animation={false}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">
                            Add New Publisher
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="form-group ">
                            <label
                              for="cname"
                              className="control-label col-lg-2"
                            >
                              Name <span className="required">*</span>
                            </label>
                            <div className="col-lg-10">
                              <input
                                onChange={(e) =>
                                  setNamePublisher(e.target.value)
                                }
                                value={namePublisher}
                                className="form-control"
                                id="cname"
                                name="fullname"
                                minlength="5"
                                type="text"
                                required
                              />
                            </div>
                            <button
                              onClick={handleAddPublisher}
                              className="btn-custom"
                            >
                              Submit
                            </button>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => setShowPublisher(false)}
                          >
                            Close
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => setShowPublisher(false)}
                          >
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>
                  <div className="form-group ">
                    <label for="comment" className="control-label col-lg-2">
                      Image upload
                    </label>
                    <div className="col-lg-10">
                      <input
                        className="form-control "
                        type="file"
                        id="ccomment"
                        name="comment"
                        required
                        onChange={(e) => handleChangeImg(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="form-group ">
                    <label for="comment" className="control-label col-lg-2">
                      Image
                    </label>
                    <div className="col-lg-10">
                      <img src={img} style={{ maxWidth: "300px" }} alt="" />
                    </div>
                  </div>

                  <div className="form-group">
                    <button onClick={handleImportShow} className="btn-custom">
                      Import
                    </button>
                  </div>
                  <Modal
                    show={showImport}
                    onHide={handleImportClose}
                    animation={false}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter">
                        Import excel file
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Please download this format excel
                      <button onClick={props.downloadFile}>Download</button>
                      to view file before import.
                      <hr />
                      <hr />
                      <div className="form-group ">
                        <label for="comment" className="control-label col-lg-2">
                          File upload
                        </label>
                        <div className="col-lg-10">
                          <input
                            className="form-control "
                            type="file"
                            id="ccomment"
                            name="comment"
                            required
                            onChange={(e) =>
                              handleChangeExcel(e.target.files[0])
                            }
                          />
                        </div>
                        <button
                          onClick={handleUploadExcel}
                          className="btn-custom"
                        >
                          Submit
                        </button>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleImportClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleImportClose}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <div className="form-group">
                    <div className="col-lg-offset-2 col-lg-10">
                      <p>{noti.noti}</p>
                    </div>
                  </div>
                  {renderBtnSubmit()}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* <div className="card card-body">{Holdon(columns)}</div> */}
    </section>
  );
}

/*
import React, { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../components/Message/errorMessage";
import { listOrders } from "../actions/orderAction";
import TableLoader from "../components/Loader/TableLoader";
import Print from "../components/Print/Print";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const OrderList = () => {
  const orderList = useSelector((state) => state.orderList);
  const userLogin = useSelector((state) => state.userLogin);

  const { orders, loading, error, count } = orderList;
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrders());
    // eslint-disable-next-line
  }, [dispatch]);

  const printAs = (e) => {
    const downloadAs = e.target.value;

    switch (downloadAs) {
      case "pdf":
        var docDefinition = {
          content: [
            //Header
            {
              table: {
                widths: ["auto", "*"],

                body: [
                  [
                    {
                      text: "SHOPPOINT",
                      style: "mainheader",
                      bold: true,
                      marginTop: 10,
                    },

                    {
                      width: "*",
                      style: "usersOrders",
                      marginBottom: 30,
                      stack: [
                        {
                          style: "h2",
                          text: `Name: ${userInfo.name}`,
                        },
                        {
                          style: "h2",
                          text: `Email: ${userInfo.email}`,
                        },
                      ],
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: function (line) {
                  return line === 1;
                },
                vLineWidth: function () {
                  return 0;
                },
                paddingBottom: function () {
                  return 5;
                },
              },
            },

            //Vitals Details
            {
              style: "header",
              table: {
                widths: "*",
                body: [
                  [
                    {
                      border: ["#5bc0de", false, false, false],
                      text: "Orders List",
                    },
                  ],
                ],
              },
            },

            orders.length > 0
              ? {
                  layout: {
                    hLineWidth: function () {
                      return 0;
                    },
                    vLineWidth: function () {
                      return 0;
                    },
                    paddingBottom: function () {
                      return 5;
                    },
                  },
                  table: {
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: "S.No",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white",
                        },
                        {
                          text: "ID",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white",
                        },
                        {
                          text: "USER",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white",
                        },
                        {
                          text: "DATE",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white",
                        },
                        {
                          text: "TOTAL PRICE",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white",
                        },
                        {
                          text: "PAID",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white",
                        },
                        {
                          text: "DELIVERED",
                          bold: true,
                          fillColor: "#2B2B52",
                          color: "white",
                        },
                      ],

                      ...orders.map((o, i) => [
                        i + 1,
                        o._id,
                        o.userId && o.userId.name,
                        o.createdAt.substring(0, 10),
                        o.totalPrice,
                        o.isPaid ? o.paidAt.substring(0, 10) : "Not paid",
                        o.isDelivered
                          ? o.deliveredAt.substring(0, 10)
                          : "Not paid",
                      ]),
                    ],
                  },

                  fontSize: 9,
                  alignment: "center",
                }
              : null,
          ],
          styles: {
            header: {
              fontSize: 12,
              marginBottom: 20,
              marginTop: 20,
              bold: true,
            },
            mainheader: {
              fontSize: 15,
            },

            usersOrders: {
              marginLeft: 315,
            },

            h2: {
              marginTop: 5,
              fontSize: 7,
            },
          },
        };
        pdfMake.createPdf(docDefinition).download("ordersList.pdf");

        break;
      case "excel":
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="clearfix">
        <span className="float-left">
          <h1>Orders ({count})</h1>
        </span>

        <span className="float-right">
          {" "}
          <Print printAs={printAs} />
        </span>
      </div>

      {loading ? (
        <TableLoader />
      ) : error ? (
        <ErrorMessage header="Something went wrong" message={error} />
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId && order.userId.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderList;
*/
