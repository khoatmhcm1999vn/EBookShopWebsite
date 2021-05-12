import React, { Component } from "react";
import { connect } from "react-redux";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { bindActionCreators } from "redux";
import * as bookActions from "../actions/book.action";
import Author from "../components/author/author";
import NavbarContainer from "./navbar.container";
import Slider from "./slider.container";
import * as userActions from "../actions/user.action";

class AuthorContainer extends Component {
  constructor() {
    super();
  }
  async componentWillMount() {
    this.props.bookActions.getAuthor();
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
    if (nextProps.page !== this.props.page) {
      this.props.bookActions.getAuthor();
    }
  }
  render() {
    return (
      <section id="container" className="">
        <NavbarContainer />
        <Slider />
        <Author
          author={this.props.author}
          currentUser={this.props.currentUser}
          isadd={this.props.isadd}
          addAuthor={(name) => this.props.bookActions.addAuthor(name)}
          updateAuthor={(id, name) =>
            this.props.bookActions.updateAuthor(id, name)
          }
          deleteAuthor={(id) => this.props.bookActions.deleteAuthor(id)}
          deactivateAuthor={(id) => this.props.bookActions.deactivateAuthor(id)}
          uploadFile={(value) => this.props.bookActions.uploadFile(value)}
          downloadFile={() => this.props.bookActions.downloadFile()}
          isupdate={this.props.isupdate}
          page={this.props.page}
          totalpage={this.props.totalpage}
          backPage={() => this.props.bookActions.authorBackPage()}
          nextPage={() => this.props.bookActions.authorNextPage()}
          setPage={(page) => this.props.bookActions.authorSetPage(page)}
        />
        {/* <ToastContainer autoClose={2000} /> */}
      </section>
    );
  }
}
const mapStateToProps = (state) => ({
  author: state.bookReducers.author.data,
  isadd: state.bookReducers.author.isadd,
  isupdate: state.bookReducers.author.isupdate,
  islogin: state.userReducers.user.islogin,
  currentUser: state.userReducers.user.currentUser,
  totalpage: state.bookReducers.author.totalpage,
  page: state.bookReducers.author.page,
});

const mapDispatchToProps = (dispatch) => {
  return {
    bookActions: bindActionCreators(bookActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AuthorContainer);
