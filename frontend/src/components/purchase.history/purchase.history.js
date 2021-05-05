import React, { Component } from "react";
import { Link } from "react-router-dom";
import HeaderTop from "../header/header.top";
import HeaderMiddle from "../header/header.middle";
import FooterTop from "../footer/footer.top";
import FooterMiddle from "../footer/footer.middle";
import FooterBottom from "../footer/footer.bottom";

class HistoryPurchase extends Component {
  constructor(props) {
    super(props);
  }
  caculatorTotalBill = (products) => {
    let total = 0;
    products.map((element, index) => {
      total += element.count * element.price;
      return total;
    });
    return total;
  };
  deleteHandler = (order) => {
    if (window.confirm("Are you sure to delete?")) {
      this.props.deleteBill(order._id);
    }
  };
  renderBill = () => {
    return this.props.purchaseHistory.map((element, index) => {
      if (element.isPaid) {
        return (
          <div
            className="table-responsive cart_info"
            style={{ marginBottom: "50px" }}
          >
            {/* <span>
              ID: <Link to={`/order/${element._id}`} />
            </span> */}
            <Link to={`/order/${element._id}`}>ID</Link>
            <span>
              Date: {new Date(element.createdAt).toLocaleDateString()}
            </span>
            {/* <span>Total: ${this.caculatorTotalBill(element.products)}</span> */}
            <span>Total: ${element.totalPrice}</span>
            <span className="destroy_disable">Destroy</span>
            <table className="table table-condensed">
              <thead>
                <tr className="cart_menu">
                  <td className="image">Item</td>
                  <td className="description">Name</td>
                  <td className="price">Price</td>
                  <td className="quantity">Quantity</td>
                  <td className="total">Total Price Not Inc Tax</td>
                  <td className="paid">Paid</td>
                  <td className="delivered">Delivered</td>
                  <td />
                </tr>
              </thead>
              <tbody>
                {element.products.map((item, index) => {
                  return (
                    <tr>
                      <td className="cart_product">
                        <Link to={`/product/${item._id}`}>
                          <img src={item.img} />
                        </Link>
                      </td>
                      <td className="cart_description">
                        <h4>
                          <a>{item.name} </a>
                        </h4>
                        {/* <p>Web ID:{item._id}</p> */}
                      </td>
                      <td className="cart_price">
                        <p>{item.price}</p>
                      </td>
                      <td className="cart_quantity">
                        <div className="cart_quantity_button">
                          <input
                            className="cart_quantity_input"
                            type="text"
                            name="quantity"
                            value={item.count}
                            autocomplete="off"
                            size="2"
                          />
                        </div>
                      </td>
                      <td className="cart_total">
                        <p className="cart_total_price">
                          {item.count * item.price}
                        </p>
                      </td>
                      <td className="cart_price">
                        {element.isPaid ? (
                          <p>Đã thanh toán</p>
                        ) : (
                          <p>Chưa thanh toán</p>
                        )}
                      </td>
                      <td className="cart_price">
                        {element.isDelivered ? (
                          <p>Đã giao hàng</p>
                        ) : (
                          <p>Chưa giao hàng</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <hr />
          </div>
        );
      } else {
        return (
          <div
            className="table-responsive cart_info"
            style={{ marginBottom: "50px" }}
          >
            <Link to={`/order/${element._id}`}>ID</Link>
            <span>
              Date: {new Date(element.createdAt).toLocaleDateString()}
              {/* Date: {new Date(element.date).toDateString("yyyy-MM-dd")} */}
            </span>
            <span>Total: ${element.totalPrice}</span>
            <span
              onClick={() => this.deleteHandler(element)}
              className="destroy"
            >
              Destroy
            </span>
            <table className="table table-condensed">
              <thead>
                <tr className="cart_menu">
                  <td className="image">Item</td>
                  <td className="description">Name</td>
                  <td className="price">Price</td>
                  <td className="quantity">Quantity</td>
                  <td className="total">Total Price Not Inc Tax</td>
                  <td className="paid">Paid</td>
                  <td className="delivered">Delivered</td>
                  <td />
                </tr>
              </thead>
              <tbody>
                {element.products.map((item, index) => {
                  return (
                    <tr>
                      <td className="cart_product">
                        <Link to={`/product/${item._id}`}>
                          <img src={item.img} />
                        </Link>
                      </td>
                      <td className="cart_description">
                        <h4>
                          <a>{item.name} </a>
                        </h4>
                        {/* <p>Web ID:{item._id}</p> */}
                      </td>
                      <td className="cart_price">
                        <p>{item.price}</p>
                      </td>
                      <td className="cart_quantity">
                        <div className="cart_quantity_button">
                          <input
                            className="cart_quantity_input"
                            type="text"
                            name="quantity"
                            value={item.count}
                            autocomplete="off"
                            size="2"
                          />
                        </div>
                      </td>
                      <td className="cart_total">
                        <p className="cart_total_price">
                          {item.count * item.price}
                        </p>
                      </td>
                      <td className="cart_price">
                        {element.isPaid ? (
                          <p>Đã thanh toán</p>
                        ) : (
                          <p>Chưa thanh toán</p>
                        )}
                      </td>
                      <td className="cart_price">
                        {element.isDelivered ? (
                          <p>Đã giao hàng</p>
                        ) : (
                          <p>Chưa giao hàng</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <hr />
          </div>
        );
      }
    });
  };
  render() {
    return (
      <div>
        <header id="header">
          <HeaderTop />
          <HeaderMiddle
            islogin={this.props.islogin}
            logout={() => this.props.logout()}
            history={this.props.history}
          />
        </header>
        <div>
          <section id="cart_items">
            <div className="container">
              <div class="breadcrumbs">
                <ol class="breadcrumb">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li className="active">Purchase history</li>
                </ol>
              </div>
              {this.renderBill()}
            </div>
          </section>
        </div>
        <footer id="footer">
          <FooterTop />
          <FooterMiddle />
          <FooterBottom />
        </footer>
      </div>
    );
  }
}
export default HistoryPurchase;
