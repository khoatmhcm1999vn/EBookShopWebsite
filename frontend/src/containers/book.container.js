import React, { Component } from "react";
import { connect } from "react-redux";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { bindActionCreators } from "redux";
import * as bookActions from "../actions/book.action";
// import Book from "../components/book/book";
import BookScreen from "../screens/BookScreen/BookScreen";
import NavbarContainer from "./navbar.container";
import Slider from "./slider.container";
import * as userActions from "../actions/user.action";
import * as productActions from "../actions/product.action";

class BookContainer extends Component {
  async componentWillMount() {
    this.props.bookActions.getCategory();
    this.props.bookActions.getPublisher();
    this.props.bookActions.getBook();
    this.props.bookActions.getAuthor();
    // this.props.productActions.getBookDetail(null);
    let res = await this.props.userActions.loadUser();
    if (!res.is_admin || this.props.currentUser === null)
      this.props.history.push("/login_register");
  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.page !== this.props.page) {
    //   this.props.bookActions.getBook();
    // }
    if (
      nextProps.islogin !== this.props.islogin &&
      nextProps.islogin === false
    ) {
      this.props.history.push("/login_register");
    }
    if (nextProps.mproductDetail !== this.props.mproductDetail) {
      // console.log(nextProps.mproductDetail);
      // this.props.productActions.getBookDetail(this.props.mproductDetail);
    }
  }
  render() {
    return (
      <section id="container" className="">
        <NavbarContainer />
        <Slider />
        <BookScreen
          book={this.props.book}
          totalpage={this.props.totalpage}
          page={this.props.page}
          category={this.props.category}
          publisher={this.props.publisher}
          author={this.props.author}
          mproductDetail={this.props.mproductDetail}
          getProductDetail={(value) =>
            this.props.productActions.getBookDetail(value)
          }
          bookActions={this.props.bookActions}
          deleteBook={(id) => this.props.bookActions.deleteBook(id)}
          deactivateBook={(id) => this.props.bookActions.deactivateBook(id)}
          backPage={() => this.props.bookActions.backPage()}
          nextPage={() => this.props.bookActions.nextPage()}
          setPage={(page) => this.props.bookActions.setPage(page)}
          isadd={this.props.isadd}
          isupdate={this.props.isupdate}
          addBook={(
            id_category,
            name,
            price,
            quantity,
            published,
            createdAt,
            describe,
            id_nsx,
            id_author,
            file
          ) =>
            this.props.bookActions.addBook(
              id_category,
              name,
              price,
              quantity,
              published,
              createdAt,
              describe,
              id_nsx,
              id_author,
              file
            )
          }
          updateBook={(
            id,
            name,
            id_category,
            price,
            quantity,
            published,
            createdAt,
            describe,
            id_nsx,
            id_author,
            file
          ) =>
            this.props.bookActions.updateBook(
              id,
              name,
              id_category,
              price,
              quantity,
              published,
              createdAt,
              describe,
              id_nsx,
              id_author,
              file
            )
          }
        />
        {/* <ToastContainer autoClose={2000} /> */}
      </section>
    );
  }
}
const mapStateToProps = (state) => ({
  book: state.bookReducers.book.data,
  totalpage: state.bookReducers.book.totalpage,
  page: state.bookReducers.book.page,
  category: state.bookReducers.category.data,
  mproductDetail: state.productReducers.product.productDetail,
  publisher: state.bookReducers.publisher.data,
  author: state.bookReducers.author.data,
  isadd: state.bookReducers.book.isadd,
  isupdate: state.bookReducers.book.isupdate,
  islogin: state.userReducers.user.islogin,
});

const mapDispatchToProps = (dispatch) => {
  return {
    bookActions: bindActionCreators(bookActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    productActions: bindActionCreators(productActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BookContainer);
