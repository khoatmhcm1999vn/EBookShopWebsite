import React, { useState, useEffect } from "react";

import * as branchActions from "../../actions/branch.action";
import { server } from "../../constants";
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import swal from "sweetalert";
import Table from "../Table";

import AdminLayout from "../../AdminLayout/AdminLayout";
import Footer from "../../Footer/Footer";

import { isAuthenticated } from "../../auth";

import * as moment from "moment";

import "./branch.css";
import loading from "../../assets/image/loading.gif";

export default (props) => {
  const branchReducer = useSelector(({ branchReducer }) => branchReducer);
  const dispatch = useDispatch();

  const [skipPageReset, setSkipPageReset] = React.useState(false);

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    let values = { _id: rowIndex, column: columnId, value: value };
    dispatch(branchActions.inline_update(user._id, token, values));
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      return props.history.push("/login");
    }
    dispatch(branchActions.Index());
  }, []);

  useEffect(() => {
    setSkipPageReset(false);
    setData(branchReducer.result);
  }, [branchReducer.result]);

  const { user, token } = isAuthenticated();

  function confirmDelete(userId, token, id, history) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(branchActions.Remove(userId, token, id, history));
        swal("Poof! Your Branch data has been deleted!", {
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

  const loadData = () => dispatch(branchActions.Index());

  const columns = React.useMemo(
    () => [
      {
        Header: "Front Image",
        accessor: "imageUrl",
        Cell: ({ cell: { value } }) => (
          <img
            class="img-fluid img-rounded"
            width={200}
            src={"http://localhost:8090/images/" + value}
            alt="a"
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name", // accessor is the "key" in the data
      },
      // {
      //   Header: "Description",
      //   accessor: "description",
      // },
      {
        Header: "Published",
        accessor: "published",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Date Of Created",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMMM Do YYYY, h:mm:ss a");
        },
      },

      // {
      //   Header: "Category",
      //   accessor: "category",
      //   Cell: ({ cell: { value } }) => {
      //     return value.map((data) => {
      //       return (
      //         <span key={data._id} className="badge">
      //           {data.name}
      //         </span>
      //       );
      //     });
      //   },
      // },
      {
        Header: "Action",
        accessor: "_id",
        Cell: ({ cell: { value } }) => {
          // alert(id)
          return (
            <>
              <Link
                to={"/branch/update/" + value}
                type="button"
                class="btn btn-primary"
                style={{ marginRight: "5px" }}
                onClick={() => dispatch(branchActions.clearState())}
              >
                Edit
              </Link>
              <Link
                to={"/branch"}
                type="button"
                class="btn btn-danger"
                onClick={() =>
                  confirmDelete(user._id, token, value, props.history)
                }
              >
                Delete
              </Link>
            </>
          );
        },
      },
    ],
    []
  );

  const Holdon = (columns) => {
    if (branchReducer.result) {
      return (
        <Table
          columns={columns}
          data={branchReducer.result}
          parent_action={branchActions}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
        />
      );
    } else {
      return <img className="img-fluid img-rounded" src={loading} alt="" />;
    }
  };

  return (
    <>
      <AdminLayout
        title="Manage Products"
        description="Perform CRUD on products"
        className="container-fluid"
      />
      <div className="">
        {/* Content Header (Page header) */}
        {/* <h2>{getTotal()}</h2> */}
        <div className="">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                {/* <h1 className="m-0 text-dark">Product Data</h1> */}
              </div>
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <Link
                      to="/admin/dashboard"
                      className="btn btn-outline-warning float-left"
                    >
                      Back
                    </Link>
                    <div className="card-tools">
                      <div className="input-group input-group-sm">
                        <button onClick={loadData}>Load Data</button>
                        <Link to="/branch/create">
                          <button type="submit" className="btn btn-default">
                            <i className="fas fa-plus" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="card card-body">{Holdon(columns, data)}</div>
                </div>

                {/* /.card */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
