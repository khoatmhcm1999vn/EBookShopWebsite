import React, { Component } from "react"
import axios from "axios"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import LoginRegister from "../components/login.register/login.register"
import * as userActions from "../actions/user.action"
import * as cartActions from "../actions/cart.action"
// import { getUser } from "../config/store.config";
// import * as homeActions from "../actions/home.action";

class LoginRegisterContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emailLogin: "",
      passwordLogin: "",
      user_name: "",
      email: "",
      firstname: "",
      lastname: "",
      address: "",
      phone: "",
      password: "",
      confirm: "",
      notificationRegister: "",
      notificationLogin: "",
      captchaValue: ""
    }
  }
  async componentDidMount() {
    let res = await this.props.actions.loadUser()
    this.props.cartActions.getCart()
    if (res.is_admin === false && this.props.currentUser !== null)
      this.props.history.push("/")
    // console.log(this.props.currentUser.user);
    else if (res.is_admin === true && this.props.currentUser !== null)
      document.location.href = "/dashboard"
    // else if (!res.is_admin || this.props.currentUser === null)
    //   this.props.history.push("/login_register");
    // else if (this.props.islogin) this.props.history.push("/");
  }
  isvalidFirstName = firstName => {
    if (firstName === "") return false
    return true
  }
  isvalidLastName = lastname => {
    if (lastname === "") return false
    return true
  }
  isvalidPassword = password => {
    if (password.length < 6) return false
    return true
  }
  isvalidConfirm = (password, confirm) => {
    if (confirm != password) return false
    return true
  }
  isvalidEmail = email => {
    if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1)
      return false
    return true
  }
  isvalidUserName = user_name => {
    if (user_name === "") return false
    return true
  }

  isvalidCaptcha = captcha => {
    if (captcha === "") return false
    return true
  }

  registerSubmit = async () => {
    console.log(this.state.captchaValue)
    if (!this.isvalidUserName(this.state.user_name)) {
      this.setState({ notificationRegister: "Username invalid" })
      return
    } else {
      this.setState({ notificationRegister: "" })
    }
    if (!this.isvalidEmail(this.state.email)) {
      this.setState({ notificationRegister: "Email invalid" })
      return
    } else {
      this.setState({ notificationRegister: "" })
    }
    if (!this.isvalidPassword(this.state.password)) {
      this.setState({ notificationRegister: "Password invalid" })
      return
    } else {
      this.setState({ notificationRegister: "" })
    }
    if (!this.isvalidConfirm(this.state.password, this.state.confirm)) {
      this.setState({ notificationRegister: "Confirm invalid" })
      return
    } else {
      this.setState({ notificationRegister: "" })
    }
    if (!this.isvalidFirstName(this.state.firstname)) {
      this.setState({ notificationRegister: "Firstname invalid" })
      return
    } else {
      this.setState({ notificationRegister: "" })
    }
    if (!this.isvalidLastName(this.state.lastname)) {
      this.setState({ notificationRegister: "Lastname invalid" })
      return
    }
    if (!this.isvalidCaptcha(this.state.captchaValue)) {
      this.setState({ notificationRegister: "Captcha empty" })
      return
    } else {
      this.setState({ notificationRegister: "" })
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user/register`, {
        user_name: this.state.user_name,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        // address: this.state.address,
        phone_number: this.state.phone,
        captchaValue: this.state.captchaValue
      })
    } catch (err) {
      console.log(err.response.data)
      if (err.response.data.message === "👎 Please select captcha")
        this.setState({ notificationRegister: "👎 Please select captcha" })
      else if (err.response.data.message === "👎 Failed captcha verification")
        this.setState({
          notificationRegister: "👎 Failed captcha verification"
        })
      else if (err.response.data.message === "👎 Email đã tồn tại!")
        this.setState({ notificationRegister: "👎 Email đã tồn tại!" })
      else this.setState({ notificationRegister: "👍 Đăng ký thành công!" })
      return
    }
    window.grecaptcha.reset()
    this.setState({ notificationRegister: "👍 Đăng ký thành công!" })
  }

  loginSubmit = async () => {
    if (!this.isvalidEmail(this.state.emailLogin)) {
      this.setState({ notificationLogin: "Email invalid" })
      return
    } else {
      this.setState({ notificationLogin: "" })
    }
    let res
    try {
      res = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, {
        email: this.state.emailLogin,
        password: this.state.passwordLogin
      })
    } catch (err) {
      if (err.response !== undefined) {
        if (err.response.data.message === "👎 User không tồn tại!") {
          this.setState({
            notificationLogin: "👎 User không tồn tại"
          })
        } else if (err.response.data.message === "👎 User chưa xác thực!")
          this.setState({
            notificationLogin: "👎 User chưa xác thực!"
          })
        else if (err.response.data.message === "👎 Mật khẩu không đúng!") {
          this.setState({
            notificationLogin: "👎 Mật khẩu không đúng!"
          })
        } else if (
          err.response.data.message ===
          "👎 You have exceeded the maximum number of login attempts!"
        ) {
          this.setState({
            notificationLogin:
              "👎 You have exceeded the maximum number of login attempts!"
          })
        } else {
          this.setState({ notificationLogin: err.response.data.message })
        }
      } else {
        this.setState({ notificationLogin: "Some thing went wrong" })
      }
      return
    }
    this.props.actions.loginSuccess(
      res.data.access_token,
      res.data.refresh_token,
      res.data.user
    )
    // if (res.data.user.is_admin) this.props.history.push("/dashboard");
    if (res.data.user.is_admin) document.location.href = "/dashboard"
    // else this.props.history.push("/");
    else document.location.href = "/"
  }
  render() {
    return (
      <div>
        <LoginRegister
          setEmailogin={value => this.setState({ emailLogin: value })}
          setPasswordlogin={value => this.setState({ passwordLogin: value })}
          setUsername={value => this.setState({ user_name: value })}
          setEmail={value => this.setState({ email: value })}
          setFirstname={value => this.setState({ firstname: value })}
          setLastname={value => this.setState({ lastname: value })}
          setAddress={value => this.setState({ address: value })}
          setPhone={value => this.setState({ phone: value })}
          notificationRegister={this.state.notificationRegister}
          notificationLogin={this.state.notificationLogin}
          setPassword={value => this.setState({ password: value })}
          setConfirm={value => this.setState({ confirm: value })}
          registerSubmit={() => this.registerSubmit()}
          loginSubmit={() => this.loginSubmit()}
          islogin={this.props.islogin}
          currentUser={this.props.currentUser}
          setCapchaValue={value => this.setState({ captchaValue: value })}
          cart={this.props.cart}
          history={this.props.history}
          // logout={() => this.props.actions.logout()}
          //   sortType={this.props.sortType}
          //   setSortType={(value) => this.props.homeActions.setSortType(value)}
          //   setRangeType={(range) => this.props.homeActions.setRangeType(range)}
          //   setSearchText={(value) => this.props.homeActions.setSearchText(value)}
          //   searchTextSubmit={() => this.props.homeActions.searchTextSubmit()}
          //   history={this.props.history}
        />
      </div>
    )
  }
}
const mapStateToProps = state => ({
  islogin: state.userReducers.user.islogin,
  currentUser: state.userReducers.user.currentUser,
  cart: state.cart.data
})
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(userActions, dispatch),
    // homeActions: bindActionCreators(homeActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRegisterContainer)
