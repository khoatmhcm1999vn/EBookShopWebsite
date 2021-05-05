import React, { Component } from "react";
import { Link } from "react-router-dom";

class EnterNewPassword extends Component {
  constructor() {
    super();
    this.state = {
      newpassword: "",
      confirm: "",
      noti: "",
    };
  }
  handleSubmit() {
    if (this.state.newpassword.length < 6) {
      this.setState({ noti: "Password must contain at least 6 characters" });
      return;
    } else {
      this.setState({ noti: "" });
    }
    if (this.state.confirm !== this.state.newpassword) {
      this.setState({
        noti: "Confirm invalid",
      });
      return;
    } else {
      this.setState({ noti: "" });
    }
    this.props.submitEnterNewPassword();
  }
  render() {
    return (
      <div className="container text-center">
        <div className="logo-404">
          <Link to="/">
            <img src="/img/home/logo.png" alt="" />
          </Link>
        </div>
        <div className="content-404 forgotpass">
          <h1>
            <b>ENTER NEW PASSWORD</b>
          </h1>
          <p style={{ color: "tomato" }}>{this.state.noti}</p>
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => {
              this.props.setNewPassword(e.target.value);
              this.setState({ newpassword: e.target.value });
            }}
          />
          <br />
          <label htmlFor="">Confirm:</label>
          <input
            type="password"
            placeholder="Confirm"
            onChange={(e) => {
              this.props.setConfirm(e.target.value);
              this.setState({ confirm: e.target.value });
            }}
          />
          <br />
          <button
            className="btn btn-default"
            onClick={() => this.handleSubmit()}
          >
            Submit
          </button>
          <h2>
            <Link to="/">Bring me back Home</Link>
          </h2>
        </div>
      </div>
    );
  }
}
export default EnterNewPassword;
