import React, { useState, useEffect } from "react";
import * as billActions from "../../actions/billActions";
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import NavbarContainer from "../../containers/navbar.container";
import Slider from "../../containers/slider.container";

import swal from "sweetalert";
import Table from "../../components/table/Table";
import { getToken, getUser } from "../../config/store.config";
// import * as moment from "moment";
// import "./BillScreen.css";
import Loading from "../../components/loading/loading";
// import DateRangeColumnFilter from "./DateRangeColumnFilter";
// import { SubRowAsync } from "../../components/table/Table";
import makeData from "../BookScreen/makeData";

import {
  NumberRangeColumnFilter,
  SliderColumnFilter,
  SelectColumnFilter,
  filterGreaterThan,
} from "../../components/table/Table";

export default function BillScreen({ history }) {
  const billReducer = useSelector(({ bill }) => bill);
  const dispatch = useDispatch();
  // const [skipPageReset, setSkipPageReset] = React.useState(false);

  //   const updateMyData = (rowIndex, columnId, value) => {
  //     // We also turn on the flag to not reset the page
  //     setSkipPageReset(true);
  //     let values = { _id: rowIndex, column: columnId, value: value };
  //     // dispatch(billActions.inline_update(values));
  //   };
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    if (getToken() === null) {
      return history.push("/login_register");
    }
    dispatch(billActions.Index());
  }, [dispatch, history]);
  useEffect(() => {
    // setSkipPageReset(false);
    setData(billReducer.result);
  }, [billReducer.result]);

  // console.log(billReducer);

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
    // setError(false);
    // setLoading(false);
  };
  const getRequestParams = (searchName, page, pageSize) => {
    let params = {};
    if (searchName) {
      params["name"] = searchName;
    }
    if (page) {
      params["page"] = page - 1;
    }
    if (pageSize) {
      params["size"] = pageSize;
    }
    return params;
  };
  const retrieveBills = () => {
    const params = getRequestParams(searchName);
    dispatch(billActions.SearchName(params));
  };

  function confirmDelete(id, history) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(billActions.Remove(id, history));
        swal("Poof! Your Bill data has been deleted!", {
          icon: "success",
        });
      }
    });
  }
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
  // Create a function that will render our row sub components
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
  const loadData = () => dispatch(billActions.Index());
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
      //   {
      //     Header: 'Name',
      //     columns: [
      //       {
      //         Header: 'First Name',
      //         // We re-map data using accessor functions for subRows
      //         accessor: (d) => d.firstName,
      //         // We can render something different for subRows
      //         SubCell: (cellProps) => (
      //           <>🥳 {cellProps.value} 🎉</>
      //         )
      //       },
      //       {
      //         Header: 'Last Name',
      //         accessor: (d) => d.lastName
      //       }
      //     ]
      //   },
      //   {
      //     Header: 'Name',
      //     columns: [
      //       {
      //         Header: 'First Name',
      //         accessor: 'firstName',
      //       },
      //       {
      //         Header: 'Last Name',
      //         accessor: 'lastName',
      //       },
      //     ],
      //   },
      {
        Header: "Name",
        accessor: (data) => {
          let output = [];
          data.products.map((item) => {
            return output.push(item.name);
          });
          return output.join(", ");
        },
        // aggregate: "count",
        // Aggregated: ({ value }) => `${value} Names`,
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
        // Footer: (info) => {
        //   // Only calculate total visits if rows change
        //   const total = React.useMemo(
        //     () => info.rows.reduce((sum, row) => row.values.quantity + sum, 0),
        //     [info.rows]
        //   );
        //   return <>Total: {total}</>;
        // },
      },
      {
        Header: "Total Price",
        accessor: "totalPrice",
        Filter: NumberRangeColumnFilter,
        filter: "between",
        aggregate: "sum",
        Aggregated: ({ value }) => `${value} (total)`,
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce((sum, row) => row.values.totalPrice + sum, 0),
            [info.rows]
          );
          return <>Total: {total}</>;
        },
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          let date = new Date(value).toDateString();
          console.log(date);
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
              <Link
                to={"/bill/update/" + value}
                type="button"
                class="btn btn-primary"
                style={{ marginRight: "5px" }}
                onClick={() => dispatch(billActions.clearState())}
              >
                Edit
              </Link>
              <button
                onClick={() => dispatch(billActions.Remove(value, history))}
                className="btn btn-danger"
              >
                <i className="icon_close_alt2" />
              </button>
            </>
          );
        },
      },
    ],
    [dispatch, history]
  );

  const Holdon = (columns) => {
    if (billReducer.result) {
      return (
        <Table
          columns={columns}
          data={billReducer.result}
          parent_action={billActions}
          // renderRowSubComponent={renderRowSubComponent}
          // updateMyData={updateMyData}
          // skipPageReset={skipPageReset}
        />
      );
    } else {
      return <Loading />;
    }
  };

  return (
    <>
      <section id="container" className="">
        <NavbarContainer />
        <Slider />
        <div className="card">
          <div className="card-header">
            <a href="/dashboard" className="btn btn-outline-warning float-left">
              Back
            </a>
            <button onClick={loadData}>Load Data</button>
            <div className="card-tools">
              <div className="input-group input-group-sm">
                <Link to="/book/create">
                  <button type="submit" className="btn btn-default">
                    <i className="fas fa-plus" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="col-md-12">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Name"
                  value={searchName}
                  onChange={onChangeSearchName}
                />
                {/* {showLoading()} */}
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={retrieveBills}
                  >
                    Search
                    {/* {showLoading()} */}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-body">{Holdon(columns, data)}</div>
        </div>
      </section>
    </>
  );
}
