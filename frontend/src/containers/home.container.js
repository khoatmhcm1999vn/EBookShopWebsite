import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
// import axios from "axios";
import Home from "../components/home/home"
import * as userActions from "../actions/user.action"
import * as homeActions from "../actions/home.action"
import * as productActions from "../actions/product.action"
import * as cartActions from "../actions/cart.action"
import Loading from "../components/loading/loading"
// import { sortTypes } from "../constants/action.types";
// import localStore from "../config/storage.config";

import { withTranslation } from "react-i18next"
import { compose } from "redux"
import numberWithCommas from "../utils/formatPrice"

class HomeContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currencyCode: "VND",
      language: "en"
    }
    this.handleChangeCurrency = this.handleChangeCurrency.bind(this)
  }
  componentWillMount() {
    this.props.actions.loadUser()
    this.props.homeActions.getCategory()
    this.props.homeActions.getPublisher()
    this.props.homeActions.getBook()
    this.props.homeActions.getAuthor()
    this.props.cartActions.getCart()
    document.title = "[TellMe] Trang bán hàng"
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.pageSize);
    if (
      nextProps.page !== this.props.page ||
      nextProps.pageSize !== this.props.pageSize
    ) {
      this.props.homeActions.getBook()
    }
  }

  handleChangeCurrency = event => {
    console.log(event.target.value)
    const { homeActions } = this.props
    this.setState({
      currencyCode: event.target.value
    })
    homeActions.onChangeCurrency(event.target.value)
  }

  changeLanguage = event => {
    this.setState({ language: event.target.value })
    this.props.i18n.changeLanguage(event.target.value)
  }

  render() {
    const { t, category, publisher, book, totalpage } = this.props
    const { currencyCode, language } = this.state
    console.log(currencyCode)
    // console.log(language);

    // const notVND = currencyCode=="VND" ? numberWithCommas(totalPrice) : numberWithCommas(parseFloat(tryConvert(totalPrice, currencyCode, false)).toFixed(2));
    if (
      category !== null &&
      publisher !== null &&
      book !== null &&
      totalpage !== null
    ) {
      return (
        <div>
          <div className="col-md-4">
            <div className="header-right">
              <ul className="list-inline ">
                <li className="dropdown dropdown-small">
                  <i className="fa fa-money-bill-wave"></i>
                  <select
                    className="select-box"
                    onChange={this.handleChangeCurrency}
                  >
                    <option value="VND">{t("header.vnd.select")}</option>
                    <option value="USD">{t("header.usd.select")}</option>
                    <option value="CNY">{t("header.cny.select")}</option>
                    <option value="EUR">{t("header.eur.select")}</option>
                    <option value="JPY">{t("header.jpy.select")}</option>
                  </select>
                </li>
                <li className="dropdown dropdown-small">
                  <i className="fa fa-globe-europe"></i>
                  <select className="select-box" onChange={this.changeLanguage}>
                    <option value="en" name="language">
                      {t("header.english.select")}
                    </option>
                    <option value="vn" name="language">
                      {t("header.vietnamese.select")}
                    </option>
                  </select>
                </li>
              </ul>
            </div>
          </div>
          <input
            type="text"
            className="w-100 form-control"
            value=""
            name="keyword"
            placeholder={t("search.placeholder.input")}
          ></input>
          <Home
            islogin={this.props.islogin}
            t={this.props.t}
            logout={() => this.props.actions.logout()}
            category={this.props.category}
            publisher={this.props.publisher}
            book={this.props.book}
            text={this.props.text}
            totalpage={this.props.totalpage}
            backPage={() => this.props.homeActions.backPage()}
            nextPage={() => this.props.homeActions.nextPage()}
            setPage={page => this.props.homeActions.setPage(page)}
            page={this.props.page}
            pageSize={this.props.pageSize}
            sortType={this.props.sortType}
            setSortType={value => this.props.homeActions.setSortType(value)}
            setRangeType={range => this.props.homeActions.setRangeType(range)}
            title={this.props.title}
            setTitle={title => this.props.homeActions.setTitle(title)}
            setBranch={branch => this.props.homeActions.setBranch(branch)}
            branch={this.props.branch}
            setSearchText={value => this.props.homeActions.setSearchText(value)}
            author={this.props.author}
            setIDBranch={id => this.props.homeActions.setIDBranch(id)}
            branchClick={(branch, id) =>
              this.props.homeActions.branchClick(branch, id)
            }
            history={this.props.history}
            searchTextSubmit={() => this.props.homeActions.searchTextSubmit()}
            addToCart={product => this.props.productActions.addToCart(product)}
            cart={this.props.cart}
            setPageSize={pageSize =>
              this.props.homeActions.setPageSize(pageSize)
            }
            isActivatedShop={true}
          />
        </div>
      )
    } else {
      return <Loading />
    }
  }
}
const mapStateToProps = state => ({
  islogin: state.userReducers.user.islogin,
  category: state.homeReducers.category.data,
  publisher: state.homeReducers.publisher.data,
  author: state.homeReducers.author.data,
  book: state.homeReducers.book.data,
  totalpage: state.homeReducers.book.totalpage,
  page: state.homeReducers.book.page,
  sortType: state.homeReducers.book.sortType,
  title: state.homeReducers.book.title,
  branch: state.homeReducers.book.branch,
  text: state.homeReducers.book.searchtext,
  cart: state.cart.data,
  pageSize: state.homeReducers.book.pageSize
})

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(userActions, dispatch),
    homeActions: bindActionCreators(homeActions, dispatch),
    productActions: bindActionCreators(productActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps)
// export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
export default compose(withConnect, withTranslation())(HomeContainer)
