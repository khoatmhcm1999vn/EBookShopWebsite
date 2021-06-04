import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import * as userActions from "../actions/user.action"
import ResendToken from "../components/ResendToken/ResendToken"
import Fail from "../components/status/fail"
import Success from "../components/status/success"

class ResendTokenContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      notification: "",
      statusResendToken: null
    }
  }

  isvalidEmail = email => {
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) return false
    return true
  }
  submit = () => {
    if (this.isvalidEmail(this.state.email)) console.log(this.state.email)
    else {
      this.setState({ notification: "Email invalid" })
      return
    }
    this.props.actions.submitResendToken(this.state.email)
  }

  componentWillUnmount() {
    this.props.actions.resetResendToken()
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isSendToken === true) {
      this.setState({
        statusResendToken: true,
        notification:
          "Token sẽ hết hạn trong vòng 3 phút vui lòng kiểm tra email để xác thực."
      })
    } else if (nextProps.isSendToken === false) {
      this.setState({
        statusResendToken: false,
        notification: "Có lỗi xảy ra."
      })
    }
    // if (nextProps.verify_otp === true) {
    //   this.setState({ verify_otp: true, notificationOTP: "" });
    // } else if (nextProps.verify_otp === false) {
    //   this.setState({ verify_otp: false, notificationOTP: "OTP CODE INVALID" });
    // }
    // if (nextProps.forgotpassword === true) {
    //   this.setState({ statusForgotPassword: true });
    // } else if (nextProps.forgotpassword === false) {
    //   this.setState({ statusForgotPassword: true });
    // }
  }

  //   submitEnterNewPassword = (password, confirm) => {
  //     if (password.length < 6) {
  //       this.setState({ notificationEnterPassowrd: "input invalid" });
  //       return;
  //     }
  //     if (confirm !== password) {
  //       this.setState({ notificationEnterPassowrd: "input invalid" });
  //       return;
  //     }
  //     this.props.actions.submitEnterNewPassword(this.state.newPassword);
  //   };
  render() {
    const { statusResendToken } = this.state
    if (statusResendToken === null) {
      return (
        <ResendToken
          setEmail={value => this.setState({ email: value })}
          submit={() => this.submit()}
          notification={this.state.notification}
        />
      )
    } else if (statusResendToken) {
      //   return (
      //     <ResendToken
      //       setEmail={(value) => this.setState({ email: value })}
      //       submit={() => this.submit()}
      //       notification={this.state.notification}
      //     />
      //   );
      return <Success notification={this.state.notification} />

      // if (this.state.statusForgotPassword) {
      //   return <Success />;
      // } else if (this.state.statusForgotPassword === false) {
      //   return <Fail />;
      // } else {
      //   return (
      //     <EnterNewPassword
      //       setNewPassword={(value) => this.setState({ newPassword: value })}
      //       setConfirm={(value) => this.setState({ confirm: value })}
      //       submitEnterNewPassword={() =>
      //         this.submitEnterNewPassword(
      //           this.state.newPassword,
      //           this.state.confirm
      //         )
      //       }
      //     />
      //   );
      // }
    } else {
      return <Fail notification={this.state.notification} />
    }
  }
}
const mapStateToProps = state => ({
  isSendToken: state.userReducers.resendToken.isSendToken
})

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(userActions, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResendTokenContainer)
