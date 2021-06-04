import React, { Component } from "react"
import axios from "axios"
import VerifyRegisterAccount from "../components/verify.register.account/verify.register.account"
import NotFound from "../components/404/404"

class VerifyRegisterAccountContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isconfirm: true
    }
  }
  async componentWillMount() {
    try {
      await axios.get(
        "http://localhost:8090/user/verify/" + this.props.match.params.token
      )
    } catch (err) {
      this.setState({ isconfirm: false })
    }
    if (!this.state.isconfirm) document.location.href = "/resend-token"
    // this.props.history.push("/resend-token");
  }
  render() {
    // console.log(this.state.isconfirm);
    // console.log(this.props.match.params.token);
    if (this.state.isconfirm) {
      return <VerifyRegisterAccount />
    } else {
      return <NotFound />
    }
  }
}
export default VerifyRegisterAccountContainer
