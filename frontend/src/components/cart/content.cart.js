import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

import { getBraintreeClientToken, processPayment } from "../../utils/api";
import DropIn from "braintree-web-drop-in-react";

class ContentCart extends Component {
  constructor() {
    super();
    this.state = {
      total: 0,
      show: false,
      email: "",
      name: "",
      phone: "",
      city: { name: "", code: null },
      district: { name: "", code: null },
      ward: { name: "", code: null },
      address: "",
      notiEmail: "",
      notiName: "",
      notiPhone: "",
      notiAddress: "",
      notiDetailAddress: "",
      notiCart: "",
      ispay: false,
      showpaymentfail: false,

      data: {
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {},
      },
    };
  }
  componentWillMount() {
    let total = 0;
    for (let i = 0; i < this.props.cart.length; i++) {
      total +=
        Number(this.props.cart[i].price) * Number(this.props.cart[i].count);
    }
    // console.log(total)

    if (!this.props.islogin) {
      getBraintreeClientToken().then((res) => {
        if (!res) {
          this.setState({
            data: {
              ...this.state.data,
              error: "fail",
            },
          });
        } else {
          this.setState({
            data: {
              ...this.state.data,
              clientToken: res.clientToken,
            },
          });
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.cart !== this.props.cart) {
      let total = 0;
      for (let i = 0; i < nextProps.cart.length; i++) {
        total +=
          Number(nextProps.cart[i].price) * Number(nextProps.cart[i].count);
      }
      this.setState({ total: total });
    }
    if (nextProps.ispay !== this.props.ispay && nextProps.ispay === true) {
      this.setState({ ispay: true });
    }
    if (nextProps.ispay !== this.props.ispay && nextProps.ispay === false) {
      this.setState({ showpaymentfail: true });
    }
  }
  reset = () => {
    this.setState({
      show: false,
      email: "",
      name: "",
      phone: "",
      city: { name: "", code: null },
      district: { name: "", code: null },
      ward: { name: "", code: null },
      address: "",
      notiEmail: "",
      notiName: "",
      notiPhone: "",
      notiAddress: "",
      notiDetailAddress: "",
      notiCart: "",
      ispay: false,
      showpaymentfail: false,
      data: {
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {},
      },
    });
  };
  handleQuantity = (e) => {
    const { value } = e.target;
    console.log(value);
    if (value < 1) {
      alert("Quantity must be greater than or equal to 1");
      return;
    }
    this.setState({ quantity: e.target.value });
  };
  handlePayment = () => {
    // if (!this.props.islogin) {
    //   this.setState({ show: true });
    //   return;
    // } else {
    //   this.setState({ show: false });
    // }
    let check = true;
    if (!this.isvalidEmail(this.state.email)) {
      this.setState({ notiEmail: "Email invalid" });
      check = false;
    } else {
      this.setState({ notiEmail: "" });
    }
    if (this.state.name.length < 3) {
      this.setState({
        notiName: "Name invalid",
      });
      check = false;
    } else {
      this.setState({
        notiName: "",
      });
    }
    if (!this.isvaidPhone(this.state.phone)) {
      this.setState({
        notiPhone: "Phone invalid",
      });
      check = false;
    } else {
      this.setState({ notiPhone: "" });
    }
    if (
      this.state.city.name === "" ||
      this.state.district.name === "" ||
      this.state.ward.name === ""
    ) {
      this.setState({
        notiAddress: "Address invalid",
      });
      check = false;
    } else {
      this.setState({
        notiAddress: "",
      });
    }
    if (this.state.address === "") {
      this.setState({ notiDetailAddress: "Address invalid" });
      check = false;
    } else {
      this.setState({ notiDetailAddress: "" });
    }
    if (this.props.cart.length == 0) {
      this.setState({ notiCart: "Please buy one product!" });
      check = false;
    } else {
      this.setState({ notiCart: "" });
    }
    if (check === false) return;

    this.props.cart.totalPrice = this.toPrice(
      this.props.cart.reduce((a, c) => a + c.count * c.price, 0)
    );
    this.props.cart.paymentMethod = this.props.cartPayment;
    // console.log(this.props.cart);
    // this.props.cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
    // this.props.cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
    // this.props.cart.totalPrice = this.props.cart.itemsPrice;
    //  + this.props.cart.shippingPrice + this.props.cart.taxPrice;

    this.setState({
      data: {
        ...this.state.data,
        loading: true,
      },
    });
    let nonce;
    let getNonce = this.state.data.instance
      .requestPaymentMethod()
      .then((res) => {
        nonce = res.nonce;

        const paymentData = {
          paymentMethodNonce: nonce,
          amount: this.props.cart.totalPrice,
        };

        processPayment(paymentData)
          .then((response) => {
            // console.log(response);
            this.setState({
              data: {
                ...this.state.data,
                success: response.success,
              },
            });

            const paymentResult = {
              id: response.transaction.id,
              status: "COMPLETED",
              update_time: response.transaction.updatedAt,
              email_address: response.transaction.paypal.payerEmail,
            };
            console.log(paymentResult);

            this.props.payment(
              this.state.city.name,
              this.state.district.name,
              this.state.ward.name,
              this.state.address,
              this.state.phone,
              this.state.name,
              this.props.cart,
              this.state.email,
              paymentResult
            );
          })
          .catch((error) => {
            console.log("DropIn error: ", error);
            this.setState({
              data: {
                ...this.state.data,
                error: error.message,
              },
            });
          });
      });

    // this.props.payment(
    //   this.state.city.name,
    //   this.state.district.name,
    //   this.state.ward.name,
    //   this.state.address,
    //   this.state.phone,
    //   this.state.name,
    //   this.props.cart,
    //   this.state.email
    // );
  };

  toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12

  isvaidPhone = (phone) => {
    if (phone.length < 10 || phone.length > 11) return false;
    for (let i = 0; i < phone.length; i++) {
      if (phone.charAt(i) < "0" || phone.charAt(i) > "9") return false;
    }
    return true;
  };
  isvalidEmail = (email) => {
    if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1)
      return false;
    return true;
  };
  handleSelectCity(value) {
    // console.log(value)
    let city = value.split("/");
    let name = city[0];
    let code = city[1];
    this.setState({
      city: { name: name, code: code },
    });
    this.props.getDistrict(code);
  }
  handleSelectDistrict(value) {
    let district = value.split("/");
    let name = district[0];
    let code = district[1];
    this.setState({
      district: { name: name, code: code },
    });
    this.props.getWard(this.state.city.code, code);
  }
  handleSelectWard(value) {
    let ward = value.split("/");
    let name = ward[0];
    let code = ward[1];
    this.setState({
      ward: { name: name, code: code },
    });
  }
  render() {
    // console.log(this.props.ispay);
    console.log(this.state.data);
    // console.log(this.state.show);
    return (
      <div>
        <section id="cart_items">
          <div className="container">
            <div className="breadcrumbs">
              <ol className="breadcrumb">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li className="active">Shopping Cart</li>
              </ol>
            </div>
            <div className="table-responsive cart_info">
              <table className="table table-condensed">
                <thead>
                  <tr className="cart_menu">
                    <td className="image">Item</td>
                    <td className="description" />
                    <td className="price">Price</td>
                    <td className="quantity">Quantity</td>
                    <td className="total">Total</td>
                    <td />
                  </tr>
                </thead>
                <tbody>
                  {this.props.cart.map((element, index) => {
                    return (
                      <tr>
                        <td className="cart_product">
                          <Link to={`/product/${element._id}`}>
                            <img src={element.img} alt="" />
                          </Link>
                        </td>
                        <td className="cart_description">
                          <h4>
                            <Link to={`/product/${element._id}`}>
                              {element.name}
                            </Link>
                          </h4>
                          {/* <p>Web ID: {element._id}</p> */}
                        </td>
                        <td className="cart_price">
                          <p>{element.price}</p>
                        </td>
                        <td className="cart_quantity">
                          <div className="cart_quantity_button">
                            <span
                              className="cart_quantity_up"
                              onClick={() => {
                                element.count += 1;
                                // if (typeof element.count === "number") {
                                //   console.log("number");
                                // }
                                // console.log(element.count);
                                this.props.updateProductInCart(element);
                              }}
                            >
                              +
                            </span>
                            <input
                              className="cart_quantity_input"
                              type="text"
                              name="quantity"
                              onChange={(e) => {
                                if (e.target.value < 1) {
                                  return;
                                } else {
                                  element.count = +e.target.value;
                                  // if (typeof element.count === "number") {
                                  //   console.log("number");
                                  // }
                                  // console.log(element.count);
                                  this.props.updateProductInCart(element);
                                }
                              }}
                              value={element.count}
                              autocomplete="off"
                              size="2"
                            />
                            <span
                              className="cart_quantity_down"
                              onClick={() => {
                                if (element.count <= 1) {
                                  return;
                                } else {
                                  element.count -= 1;
                                  this.props.updateProductInCart(element);
                                }
                              }}
                            >
                              -
                            </span>
                          </div>
                        </td>
                        <td className="cart_total">
                          <p className="cart_total_price">
                            {element.price * element.count}
                          </p>
                        </td>
                        <td className="cart_delete">
                          <button
                            className="cart_quantity_delete"
                            onClick={() =>
                              this.props.deteleProductInCart(element._id)
                            }
                          >
                            <i className="fa fa-times" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section id="do_action">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div class="total_area">
                  <ul>
                    <li>
                      Cart Sub Total <span>${this.state.total}</span>
                    </li>
                    <li>
                      Eco Tax <span>$0</span>
                    </li>
                    <li>
                      Shipping Cost <span>Free</span>
                    </li>
                    <li>
                      Total <span>${this.state.total}</span>
                    </li>
                    <span style={{ color: "red" }}>{this.state.notiCart}</span>
                  </ul>
                  <Modal
                    show={this.state.show}
                    onHide={() => this.setState({ show: false })}
                    animation={false}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter">
                        Notification
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Please <Link to="/login_register">sign in</Link> to
                      continue!!!
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={() => this.setState({ show: false })}>
                        <a>Cancel</a>
                      </Button>
                      <Button onClick={this.handleHide}>
                        <Link to="/login_register">Login</Link>
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Link class="btn btn-default check_out" to={"/"}>
                    Continue shopping
                  </Link>
                </div>
              </div>
              <div className="col-md-6">
                <div className="chose_area">
                  <ul class="user_option">
                    <li>
                      <label>Email</label>
                      <input
                        type="text"
                        value={this.state.email}
                        onChange={(e) =>
                          this.setState({ email: e.target.value })
                        }
                      />
                      <span>{this.state.notiEmail}</span>
                    </li>
                    <li>
                      <label>Name</label>
                      <input
                        type="text"
                        value={this.state.name}
                        onChange={(e) =>
                          this.setState({ name: e.target.value })
                        }
                      />
                      <span>{this.state.notiName}</span>
                    </li>
                    <li>
                      <label>Phone</label>
                      <input
                        type="text"
                        value={this.state.phone}
                        onChange={(e) =>
                          this.setState({ phone: e.target.value })
                        }
                      />
                      <span>{this.state.notiPhone}</span>
                    </li>
                  </ul>
                  <ul className="user_info">
                    <li className="single_field">
                      <label>Province / city</label>
                      <select
                        onChange={(e) => this.handleSelectCity(e.target.value)}
                      >
                        <option
                          value=""
                          disabled
                          selected
                          style={{ display: "none" }}
                        >
                          Province / city
                        </option>
                        {this.props.city.map((element, index) => {
                          return (
                            <option value={element.name + "/" + element.code}>
                              {element.name}
                            </option>
                          );
                        })}
                      </select>
                    </li>
                    <li className="single_field">
                      <label>District</label>
                      <select
                        onChange={(e) =>
                          this.handleSelectDistrict(e.target.value)
                        }
                      >
                        <option
                          value=""
                          disabled
                          selected
                          style={{ display: "none" }}
                        >
                          District
                        </option>
                        {this.props.district.map((element, index) => {
                          return (
                            <option value={element.name + "/" + element.code}>
                              {element.name}
                            </option>
                          );
                        })}
                      </select>
                    </li>
                    <li className="single_field">
                      <label>Ward</label>
                      <select
                        onChange={(e) => this.handleSelectWard(e.target.value)}
                      >
                        <option
                          value=""
                          disabled
                          selected
                          style={{ display: "none" }}
                        >
                          Ward
                        </option>
                        {this.props.ward.map((element, index) => {
                          return (
                            <option value={element.name + "/" + element.code}>
                              {element.name}
                            </option>
                          );
                        })}
                      </select>
                    </li>
                    <span>{this.state.notiAddress}</span>
                  </ul>
                  <ul className="user_option">
                    <li>
                      <label>Address</label>
                      <input
                        type="text"
                        value={this.state.address}
                        onChange={(e) =>
                          this.setState({ address: e.target.value })
                        }
                      />
                      <span>{this.state.notiDetailAddress}</span>
                    </li>
                  </ul>
                  <Modal
                    show={this.state.ispay}
                    onHide={() => this.setState({ ispay: false })}
                    animation={false}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter">
                        Notification
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Payment successfully, please check mail to verify order
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        onClick={() => {
                          this.reset();
                          document.location.href = "/";
                          // window.location.reload();
                        }}
                      >
                        <a>OK</a>
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <Modal
                    show={this.state.showpaymentfail}
                    onHide={() => this.setState({ showpaymentfail: false })}
                    animation={false}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter">
                        Notification
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Payment Fail</Modal.Body>
                    <Modal.Footer>
                      <Button
                        onClick={() =>
                          this.setState({ showpaymentfail: false })
                        }
                      >
                        <a>Cancel</a>
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  {!this.props.islogin && this.state.data.clientToken && (
                    <>
                      <DropIn
                        options={{
                          authorization: this.state.data.clientToken,
                          paypal: {
                            flow: "vault",
                          },
                        }}
                        onInstance={(instance) =>
                          this.setState({
                            data: {
                              ...this.state.data,
                              instance: instance,
                            },
                          })
                        }
                      />
                      <button
                        className="btn btn-default update"
                        onClick={() => this.handlePayment()}
                      >
                        Payment
                      </button>
                    </>
                  )}

                  {/* {this.props.islogin ? (
                    this.props.cart.length == 0 ? (
                      <h2>Your cart is empty. Please buy something!</h2>
                    ) : (
                      <Link
                        className="btn btn-default update"
                        // onClick={() => this.handlePayment()}
                        to="/shipping"
                      >
                        Shipping
                      </Link>
                    )
                  ) : (
                    <>
                      Please <Link to="/login_register">sign in</Link> to
                      checkout!!!
                    </>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default ContentCart;
