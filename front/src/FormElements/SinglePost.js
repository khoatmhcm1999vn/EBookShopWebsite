import React, { Component } from "react";

import Image from "./Image";

import ShowImage from "../core/ShowImage";

import classes from "./SinglePost.css";

class SinglePost extends Component {
  state = {
    name: "",
    quantity: "",
    date: "",
    image: "",
    // content: "",
  };

  componentDidMount() {
    const productId = this.props.match.params.productId;
    fetch("http://localhost:8090/api/product/" + productId, {
      // headers: {
      //   Authorization: "Bearer " + this.props.token,
      // },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({
          name: resData.product.name,
          quantity: resData.product.quantity,
          image: "http://localhost:8090/" + resData.product.imageUrl,
          date: new Date(resData.post.createdAt).toLocaleDateString("en-US"),
          // content: resData.post.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className={classes.Single__post}>
        <h1>{this.state.name}</h1>
        <h2>
          Created by {this.state.quantity} on {this.state.date}
        </h2>
        <div className={classes.Single__post__image}>
          <ShowImage contain imageUrl={this.state.image} />
        </div>
        {/* <p>{this.state.content}</p> */}
      </section>
    );
  }
}

export default SinglePost;
