import React, { Component } from "react";
import { Link } from "react-router-dom";
import storeConfig from "../../config/store.config";
import Favorite from "../../components/Favorite";
import Rating from "../../components/rating/Rating";

class ContentProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      notificationComment: "",
      comment: "",
      ratingValue: "",
      quantity: 1,
      noti: "",
      pagination: [],
    };
  }
  componentWillMount() {
    let tmp = [];
    for (let i = 1; i <= this.props.totalpage; i++) {
      tmp.push(i);
    }
    this.setState({ pagination: tmp });
    if (storeConfig.getUser() !== null) {
      this.setState({
        name: storeConfig.getUser().firstName,
        email: storeConfig.getUser().email,
      });
    } else {
      this.setState({
        name: "",
        email: "",
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.totalpage !== this.props.totalpage) {
      let tmp = [];
      for (let i = 1; i <= nextProps.totalpage; i++) {
        tmp.push(i);
      }
      this.setState({ pagination: tmp });
    }
    if (nextProps.islogin === false) {
      this.setState({
        name: "",
        email: "",
      });
    }
  }
  renderPagination() {
    if (this.state.pagination.length === 0) {
      return null;
    } else {
      return (
        <ul className="pagination pagination-custom">
          <li onClick={() => this.props.backPage()}>
            <a>&laquo;</a>
          </li>
          {this.state.pagination.map((element, index) => {
            if (this.props.page === element) {
              return (
                <li
                  className="active"
                  onClick={() => this.props.setPage(element)}
                >
                  <a>{element}</a>
                </li>
              );
            } else {
              return (
                <li onClick={() => this.props.setPage(element)}>
                  <a>{element}</a>
                </li>
              );
            }
          })}
          <li onClick={() => this.props.nextPage()}>
            <a>&raquo;</a>
          </li>
        </ul>
      );
    }
  }
  handlename = (name) => {
    if (this.state.name === "") {
      this.setState({ name: name });
    }
  };
  handleQuantity = (e) => {
    const { value } = e.target;
    // console.log(value);
    if (value < 1) {
      // alert("Quantity must be greater than or equal to 1");
      return;
    }
    this.setState({ quantity: e.target.value });
  };
  submitComment = () => {
    if (this.state.name === "") {
      this.setState({ notificationComment: "Name must not be blank " });
      return;
    } else {
      this.setState({ notificationComment: "" });
    }
    if (this.state.comment === "") {
      this.setState({ notificationComment: "Comment must not be blank " });
      return;
    } else {
      this.setState({ notificationComment: "" });
    }
    if (this.state.ratingValue === "") {
      this.setState({ notificationComment: "Rating must not be blank " });
      return;
    } else {
      this.setState({ notificationComment: "" });
    }
    this.props.submitComment(
      this.state.name,
      this.state.email,
      this.state.comment,
      this.state.ratingValue,
      this.props.id_book
    );
    this.setState({ comment: "" });
  };
  submitOrder = () => {
    if (this.state.quantity < 0) {
      this.setState({ noti: "Quantity invalid" });
      return;
    } else {
      this.setState({ noti: "" });
    }
    let product = this.props.mproductDetail;
    product.count = this.state.quantity;
    this.props.addToCart(product);
  };
  render() {
    // console.log(this.state.quantity);
    return (
      <section>
        <div className="container">
          <div className="row">
            <div className="col-sm-3">
              <div className="left-sidebar">
                <h2>Category</h2>
                <div className="panel-group category-products" id="accordian">
                  {this.props.category.map((element, index) => {
                    return (
                      <div key={index} className="panel panel-default">
                        <div className="panel-heading">
                          <h4 className="panel-title">
                            <a key={index}>{element.name}</a>
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="brands_products">
                  <h2>Publisher</h2>
                  <div className="brands-name">
                    <ul className="nav nav-pills nav-stacked">
                      {this.props.publisher.map((element, index) => {
                        return (
                          <li>
                            <a href="#">
                              {" "}
                              <span className="pull-right" />
                              {element.name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-9 padding-right">
              <div className="product-details">
                <div className="col-sm-5">
                  <div className="view-product">
                    <img src={this.props.mproductDetail.img} alt="" />
                  </div>
                  <div
                    id="similar-product"
                    className="carousel slide"
                    data-ride="carousel"
                  >
                    <div className="carousel-inner">
                      <div className="item active">
                        <a href="">
                          <img src="/img/product-details/similar1.jpg" alt="" />
                        </a>
                        <a href="">
                          <img src="/img/product-details/similar2.jpg" alt="" />
                        </a>
                        <a href="">
                          <img src="/img/product-details/similar3.jpg" alt="" />
                        </a>
                      </div>
                      <div className="item">
                        <a href="">
                          <img src="/img/product-details/similar1.jpg" alt="" />
                        </a>
                        <a href="">
                          <img src="/img/product-details/similar2.jpg" alt="" />
                        </a>
                        <a href="">
                          <img src="/img/product-details/similar3.jpg" alt="" />
                        </a>
                      </div>
                      <div className="item">
                        <a href="">
                          <img src="/img/product-details/similar1.jpg" alt="" />
                        </a>
                        <a href="">
                          <img src="/img/product-details/similar2.jpg" alt="" />
                        </a>
                        <a href="">
                          <img src="/img/product-details/similar3.jpg" alt="" />
                        </a>
                      </div>
                    </div>

                    <a
                      className="left item-control"
                      href="#similar-product"
                      data-slide="prev"
                    >
                      <i className="fa fa-angle-left" />
                    </a>
                    <a
                      className="right item-control"
                      href="#similar-product"
                      data-slide="next"
                    >
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-sm-7">
                  <div className="product-information">
                    {/* <img
                      src="/img/product-details/new.jpg"
                      className="newarrival"
                      alt=""
                    /> */}
                    <h1>
                      <b>{this.props.mproductDetail.name}</b>
                    </h1>
                    {/* <p>Mã sách: {this.props.mproductDetail._id}</p> */}
                    {/* <img src="/img/product-details/rating.png" alt="" /> */}
                    {/* <Rating
                      value={this.props.mproductDetail.stars}
                      text={`${this.props.mproductDetail.reviewCount} reviews`}
                    ></Rating> */}
                    {this.props.mproductDetail.stars &&
                    this.props.mproductDetail.stars ? (
                      <Rating
                        value={this.props.mproductDetail.stars}
                        text={`${this.props.mproductDetail.reviewCount} reviews`}
                      />
                    ) : (
                      <h3>Chưa có star nào.</h3>
                    )}
                    {/* {this.props.mproductDetail.reviewCount &&
                    this.props.mproductDetail.reviewCount ? (
                      <Rating value={this.props.mproductDetail.reviewCount}>
                        reviews
                      </Rating>
                    ) : (
                      <h3>Chưa có review nào.</h3>
                    )} */}

                    <span>
                      <span>US ${this.props.mproductDetail.price}</span>
                      Số lượng: &nbsp;
                      <input
                        type="number"
                        min="0"
                        onChange={(e) => this.handleQuantity(e)}
                        value={this.state.quantity}
                      />
                      <button
                        onClick={() => this.submitOrder()}
                        type="button"
                        className="btn btn-fefault cart"
                      >
                        <i className="fa fa-shopping-cart" />
                        Add to cart
                      </button>
                    </span>
                    <p>{this.state.noti}</p>
                    <p>
                      <b>Description:</b> {this.props.mproductDetail.describe}
                    </p>
                    <p>
                      <b>Category:</b> {this.props.nameCategory}
                    </p>
                    <p>
                      <b>Release date: </b>{" "}
                      {new Date(
                        this.props.mproductDetail.release_date
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <b>Publisher:</b> {this.props.namePublicsher}
                    </p>
                    <p>
                      <b>Author:</b> {this.props.nameAuthor}
                    </p>
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {this.props.islogin && this.props.islogin ? (
                        <Favorite
                          image={this.props.mproductDetail.img}
                          bookTitle={this.props.mproductDetail.name}
                          id_book={this.props.mproductDetail._id}
                          id_user={storeConfig.getUser().id}
                        />
                      ) : (
                        <div key={1} className="panel panel-default">
                          <div className="panel-heading">
                            <h4 className="panel-title">
                              <a key={1}>
                                You are not logged in. Please
                                <Link to="/login_register"> log in</Link> to add
                                your favourite product.
                              </a>
                            </h4>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* <a href="">
                      <img
                        src="/img/product-details/share.png"
                        className="share img-responsive"
                        alt=""
                      />
                    </a> */}
                  </div>
                </div>

                <div className="category-tab shop-details-tab">
                  <div className="col-sm-12">
                    <ul className="nav comment">
                      <li className="active">
                        <a href="#reviews" data-toggle="tab">
                          Reviews
                        </a>
                      </li>
                    </ul>

                    <div className="tab-pane fade active in" id="reviews">
                      <div className="col-sm-12">
                        <div className="content-conment">
                          {this.props.comment.map((element, index) => {
                            return (
                              <p style={{ backgroundColor: "white" }}>
                                <Rating
                                  value={this.props.mproductDetail.stars}
                                />
                                <span>
                                  Name
                                  {element.name}:
                                </span>
                                {element.comment}
                              </p>
                            );
                          })}
                          {this.renderPagination()}
                        </div>
                        <hr />
                        <p style={{ color: "#5BBCEC" }}>
                          {this.state.notificationComment}
                        </p>
                        <p>
                          <b>Write Your Review</b>
                        </p>

                        <form action="#">
                          <span>
                            <input
                              type="text"
                              placeholder="Your Name"
                              value={this.state.name}
                              onChange={(e) =>
                                this.setState({ name: e.target.value })
                              }
                            />
                            <input
                              type="email"
                              placeholder="Email Address"
                              value={this.state.email}
                            />
                          </span>
                          <textarea
                            value={this.state.comment}
                            onChange={(e) =>
                              this.setState({ comment: e.target.value })
                            }
                          />
                          <label>Star</label>
                          <select
                            onChange={(e) =>
                              this.setState({ ratingValue: e.target.value })
                            }
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </select>
                          {this.props.islogin && this.props.islogin ? (
                            <button
                              type="button"
                              className="btn btn-default pull-right"
                              onClick={() => this.submitComment()}
                            >
                              Submit
                            </button>
                          ) : (
                            <div key={1} className="panel panel-default">
                              <div className="panel-heading">
                                <h4 className="panel-title">
                                  <a key={1}>
                                    You are not logged in. Please
                                    <Link to="/login_register"> log in</Link> to
                                    write your comment.
                                  </a>
                                </h4>
                              </div>
                            </div>
                          )}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="recommended_items">
                  <h2 className="title text-center">recommended items</h2>
                  <div
                    id="recommended-item-carousel"
                    className="carousel slide"
                    data-ride="carousel"
                  >
                    <div className="carousel-inner">
                      <div className="item active">
                        {this.props.bookrelated.map((element, index) => {
                          return (
                            <div className="col-sm-4">
                              <div className="product-image-wrapper">
                                <div className="single-products">
                                  <div className="productinfo text-center">
                                    <Link to={"/product/" + element._id}>
                                      <img src={element.img} alt="" />
                                      <h2>${element.price}</h2>
                                      <p>{element.name}</p>
                                    </Link>
                                    <button
                                      onClick={() => {
                                        element.count = 1;
                                        this.props.addToCart(element);
                                      }}
                                      type="button"
                                      className="btn btn-default add-to-cart"
                                    >
                                      <i className="fa fa-shopping-cart" />
                                      Add to cart
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <a
                      className="left recommended-item-control"
                      href="#recommended-item-carousel"
                      data-slide="prev"
                    >
                      <i className="fa fa-angle-left" />
                    </a>
                    <a
                      className="right recommended-item-control"
                      href="#recommended-item-carousel"
                      data-slide="next"
                    >
                      <i className="fa fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default ContentProductDetail;
