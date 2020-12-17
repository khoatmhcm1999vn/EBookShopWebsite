import Chart from "react-google-charts";
import React, { useState, useEffect, Component } from "react";
import Layout from "../Layout/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import {
  listOrders,
  getStatusValues,
  updateOrderStatus,
  listOrdersChart,
} from "../admin/apiAdmin";
import axios from "axios";
import moment from "moment";

import Card from "../core/Card";
import Search from "../core/Search";
import Paginator from "../Paginator/Paginator";

class Home extends Component {
  state = {
    posts: [],
    totalPosts: 0,
    postPage: 1,
    postsLoading: true,
    chart: {},
  };

  componentDidMount() {
    this.getData();
    // this.loadPosts();
    console.log(this.state.chart);
  }

  getData = async () => {
    fetch(`http://localhost:8090/api/order/listchart`)
      .then((res) => res.json())
      .then((jsonarray) => {
        var labels = jsonarray.map(function (e) {
          return moment(e.createdAt).fromNow();
        });

        // let abc = [];
        // var a = [];
        var data = jsonarray.map(function (e, i) {
          return e.amount;
        });

        console.log(labels, data);
        // console.log(labels);

        this.setState({
          chart: {
            // labels: Object.keys(res.data[0]),
            labels: labels,
            datasets: [
              {
                label: "Orders Web Vladimir Khoa",
                // fill: false,
                // lineTension: 0.1,
                // backgroundColor: "rgba(75,192,192,0.4)",
                // borderColor: "rgba(75,192,192,1)",
                // borderCapStyle: "butt",
                // borderDash: [],
                // borderDashOffset: 0.0,
                // borderJoinStyle: "miter",
                // pointBorderColor: "rgba(75,192,192,1)",
                // pointBackgroundColor: "#fff",
                // pointBorderWidth: 1,
                // pointHoverRadius: 5,
                // pointHoverBackgroundColor: "rgba(75,192,192,1)",
                // pointHoverBorderColor: "rgba(220,220,220,1)",
                // pointHoverBorderWidth: 2,
                // pointRadius: 1,
                // pointHitRadius: 10,
                // data: Object.values(res.data[0]),
                data: Object.values(data),
              },
            ],
          },
        });
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  // loadPosts = (direction) => {
  //   if (direction) {
  //     this.setState({ postsLoading: true, posts: [] });
  //   }
  //   let page = this.state.postPage;
  //   if (direction === "next") {
  //     page++;
  //     this.setState({ postPage: page });
  //   }
  //   if (direction === "previous") {
  //     page--;
  //     this.setState({ postPage: page });
  //   }
  //   fetch("http://localhost:8090/api/listproducts?page=" + page, {
  //     method: "GET",
  //   })
  //     .then((res) => {
  //       if (res.status !== 200) {
  //         throw new Error("Failed to fetch posts.");
  //       }
  //       return res.json();
  //     })
  //     .then((resData) => {
  //       this.setState({
  //         posts: resData.products.map((post) => {
  //           return {
  //             ...post,
  //             imagePath: post.imageUrl,
  //           };
  //         }),
  //         totalPosts: resData.totalItems,
  //         postsLoading: false,
  //       });
  //     })
  //     .catch(this.catchError);
  // };

  render() {
    return (
      <Layout
        title="Orders Chart"
        description="Node React"
        className="container-fluid"
      >
        <Search />

        <div>
          <Chart data={this.state.chart} />
        </div>

        {/* <Paginator
          onPrevious={this.loadPosts.bind(this, "previous")}
          onNext={this.loadPosts.bind(this, "next")}
          lastPage={Math.ceil(this.state.totalPosts / 2)}
          currentPage={this.state.postPage}
        >
          <h2 className="mb-4">Best Sellers</h2>
          <div className="row">
            {this.state.posts.map((post, i) => (
              <div key={i} className="col-4 mb-3">
                <Card product={post} />
              </div>
            ))}
          </div>
        </Paginator> */}
      </Layout>
    );
  }
}

export default Home;
