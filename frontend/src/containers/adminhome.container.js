import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as homeActions from "../actions/home.action";
import AdminHome from "../components/home/adminhome";
import NavbarContainer from "./navbar.container";
import Slider from "./slider.container";
import * as userActions from "../actions/user.action";

class AdminHomeContainer extends Component {
  async componentWillMount() {
    this.props.homeActions.getTopProduct();
    let res = await this.props.userActions.loadUser();
    // console.log(res)
    // console.log(this.props.currentUser.user.is_admin);
    if (
      res === false ||
      !this.props.currentUser.user.is_admin ||
      this.props.currentUser === null
    )
      this.props.history.push("/login_register");
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
        <AdminHome top_product={this.props.top_product} />
      </section>
    );
  }
}
const mapStateToProps = (state) => ({
  top_product: state.homeReducers.home.top_product,
  islogin: state.userReducers.user.islogin,
  currentUser: state.userReducers.user.currentUser,
});

const mapDispatchToProps = (dispatch) => {
  return {
    homeActions: bindActionCreators(homeActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AdminHomeContainer);
