import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import * as bookActions from "../actions/book.action";
import NavbarContainer from "./navbar.container";
import Slider from "./slider.container";
import * as userActions from "../actions/user.action";
import Bill from "../components/bill/bill";

class BillContainer extends Component {
  constructor() {
    super();
  }
  async componentWillMount() {
    this.props.bookActions.getBill("true");
    let res = await this.props.userActions.loadUser();
    if (!res.is_admin || this.props.currentUser === null)
      this.props.history.push("/login_register");
    // if (
    //   res === false ||
    //   !this.props.currentUser.user.is_admin ||
    //   this.props.currentUser === null
    // )
    //   this.props.history.push("/login_register");
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.islogin !== this.props.islogin &&
      nextProps.islogin === false
    ) {
      this.props.history.push("/login_register");
    }
  }
  render() {
    return (
      <section id="container" className="">
        <NavbarContainer />
        <Slider />
        <Bill
          page={this.props.page}
          totalpage={this.props.totalpage}
          bill={this.props.bill}
          backPage={() => this.props.bookActions.billBackPage()}
          nextPage={() => this.props.bookActions.billNextPage()}
          setPage={(page) => this.props.bookActions.billSetPage(page)}
          getBill={(status) => this.props.bookActions.getBill(status)}
          deleteBill={(id) => this.props.bookActions.deleteBill(id)}
          deactivateBill={(id) => this.props.bookActions.deactivateBill(id)}
          deliverBill={(id) => this.props.bookActions.deliverBill(id)}
        />
        {/* <ToastContainer autoClose={2000} /> */}
      </section>
    );
  }
}
const mapStateToProps = (state) => ({
  islogin: state.userReducers.user.islogin,
  totalpage: state.bookReducers.bill.totalpage,
  page: state.bookReducers.bill.page,
  bill: state.bookReducers.bill.data,
});

const mapDispatchToProps = (dispatch) => {
  return {
    bookActions: bindActionCreators(bookActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BillContainer);
