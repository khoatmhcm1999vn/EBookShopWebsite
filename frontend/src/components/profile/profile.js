import { Link } from "react-router-dom";
import React, { Component } from "react";
import HeaderTop from "../header/header.top";
import HeaderMiddle from "../header/header.middle";
// import HeaderBottom from "../header/header.bottom";
import FooterTop from "../footer/footer.top";
import FooterMiddle from "../footer/footer.middle";
import FooterBottom from "../footer/footer.bottom";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notiUpdateInfor: "",
      oldPassword: "",
      newPassword: "",
      confirm: "",
      notiUpdatePassword: "",
    };
  }
  componentWillMount() {
    if (this.props.isupdate) {
      this.setState({ notiUpdateInfor: "UPDATE SUCCESS" });
    } else if (this.props.isupdate === false) {
      this.setState({ notiUpdateInfor: "UPDATE FAIL" });
    } else {
      this.setState({ notiUpdateInfor: "" });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isupdate === true) {
      this.setState({ notiUpdateInfor: "UPDATE SUCCESS" });
    } else if (nextProps.isupdate === false) {
      this.setState({ notiUpdateInfor: "UPDATE FAIL" });
    } else {
      this.setState({ notiUpdateInfor: "" });
    }
    if (
      nextProps.notiupdatePassword !== this.props.notiupdatePassword &&
      nextProps.notiupdatePassword === true
    ) {
      this.setState({
        notiUpdatePassword: "Update password success",
      });
      this.setState({
        oldPassword: "",
        newPassword: "",
        confirm: "",
      });
      this.props.resetUpdatePassword();
    }
    if (
      nextProps.notiupdatePassword !== this.props.notiupdatePassword &&
      nextProps.notiupdatePassword === false
    ) {
      this.setState({
        notiUpdatePassword: "Update password fail",
      });
      this.props.resetUpdatePassword();
    }
  }
  handleUpdatePassword() {
    if (this.state.newPassword.length < 6) {
      this.setState({ notiUpdatePassword: "New Password invalid" });
      return;
    } else {
      this.setState({ notiUpdatePassword: "" });
    }
    if (this.state.confirm.length < 6) {
      this.setState({ notiUpdatePassword: "Confirm Password invalid" });
      return;
    } else {
      this.setState({ notiUpdatePassword: "" });
    }
    this.props.updatePassword(this.state.oldPassword, this.state.newPassword);
  }
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
        <section id="cart_items">
          <div className="container">
            <div className="breadcrumbs">
              <ol className="breadcrumb">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/purchase_history">Purchase history</Link>
                </li>
              </ol>
            </div>
            <div className="shopper-informations">
              <div className="row">
                <div className="col-sm-8">
                  <div className="shopper-info">
                    <p>USER INFORMATIONS</p>
                    <p className="error">{this.state.notiUpdateInfor}</p>
                    <label htmlFor="">Email:</label>
                    <input
                      type="text"
                      disabled
                      placeholder="Email"
                      value={this.props.email}
                    />
                    <label htmlFor="">First name:</label>
                    <input
                      type="text"
                      placeholder="First name"
                      value={this.props.firstName}
                      onChange={(e) => this.props.setFirstName(e.target.value)}
                    />
                    <label htmlFor="">Last name:</label>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={this.props.lastName}
                      onChange={(e) => this.props.setLastName(e.target.value)}
                    />
                    {/* <input
                      type="text"
                      placeholder="Address"
                      value={this.props.address}
                      onChange={(e) => this.props.setAddress(e.target.value)}
                    /> */}
                    <label htmlFor="">Phone number:</label>
                    <input
                      type="tell"
                      placeholder="Phone number"
                      value={this.props.phone_number}
                      onChange={(e) =>
                        this.props.setPhoneNumber(e.target.value)
                      }
                    />
                    <button
                      onClick={() => this.props.updateInfor()}
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="shopper-info">
                    <p>UPDATE PASSWORD</p>
                    <p className="error">{this.state.notiUpdatePassword}</p>
                    <label htmlFor="">Old password:</label>
                    <input
                      value={this.state.oldPassword}
                      onChange={(e) =>
                        this.setState({ oldPassword: e.target.value })
                      }
                      type="password"
                      placeholder="Old password"
                    />
                    <label htmlFor="">New password:</label>
                    <input
                      value={this.state.newPassword}
                      onChange={(e) =>
                        this.setState({ newPassword: e.target.value })
                      }
                      type="password"
                      placeholder="New password"
                    />
                    <label htmlFor="">Confirm:</label>
                    <input
                      value={this.state.confirm}
                      onChange={(e) =>
                        this.setState({ confirm: e.target.value })
                      }
                      type="password"
                      placeholder="Confirm"
                    />
                    <button
                      onClick={() => this.handleUpdatePassword()}
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer id="footer">
          <FooterTop />
          <FooterMiddle />
          <FooterBottom />
        </footer>
      </div>
    );
  }
}
export default Profile;
