import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import * as homeActions from "../actions/home.action"
import AdminHome from "../components/home/adminhome"
import NavbarContainer from "./navbar.container"
import Slider from "./slider.container"
import * as userActions from "../actions/user.action"

class AdminHomeContainer extends Component {
  async componentDidMount() {
    this.props.homeActions.getTopProduct()
    this.props.homeActions.getCountProductBill()
    this.props.homeActions.getCountProductStock()
    this.props.homeActions.getCountBill()

    let res = await this.props.userActions.loadUser()
    // console.log(res);
    // console.log(this.props.currentUser.user.is_admin);
    if (res === false || !res.is_admin || res === null)
      this.props.history.push("/login_register")
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.islogin !== this.props.islogin &&
      nextProps.islogin === false
    ) {
      this.props.history.push("/login_register")
    }
  }
  render() {
    return (
      <section id="container" className="">
        <NavbarContainer />
        <Slider activateHome={true} />
        <AdminHome
          top_product={this.props.top_product}
          countProductBill={this.props.countProductBill}
          countProductStock={this.props.countProductStock}
          countBill={this.props.countBill}
        />
      </section>
    )
  }
}
const mapStateToProps = state => ({
  top_product: state.homeReducers.home.top_product,
  countProductBill: state.homeReducers.home.countProductBill,
  countProductStock: state.homeReducers.home.countProductStock,
  countBill: state.homeReducers.home.countBill,

  islogin: state.userReducers.user.islogin,
  currentUser: state.userReducers.user.currentUser
})

const mapDispatchToProps = dispatch => {
  return {
    homeActions: bindActionCreators(homeActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminHomeContainer)
