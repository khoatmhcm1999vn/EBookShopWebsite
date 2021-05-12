import React, { Component } from "react";
import { Link } from "react-router-dom";
import { sortTypes } from "../../constants/action.types";
import _ from "lodash";

class HeaderBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleSort: "Sort",
      listActionSort: [],
    };
  }
  componentWillMount() {
    const { sortType } = this.props;
    if (sortType === sortTypes.SORT_DAY_DECREASED) {
      this.setState({ titleSort: "Sort by day decrease" });
    } else if (sortType === sortTypes.SORT_DAY_INCREASED) {
      this.setState({ titleSort: "Sort by day increase" });
    } else if (sortType === sortTypes.SORT_PRICE_DECREASED) {
      this.setState({ titleSort: "Sort by price decrease" });
    } else if (sortType === sortTypes.SORT_PRICE_INCREASED) {
      this.setState({ titleSort: "Sort by price increase" });
    } else if (sortType === sortTypes.SORT_SALES_DECREASED) {
      this.setState({ titleSort: "Sort by sales decrease" });
    } else if (sortType === sortTypes.SORT_SALES_INCREASED) {
      this.setState({ titleSort: "Sort by sales increase" });
    } else if (sortType === sortTypes.SORT_VIEWS_DECREASED) {
      this.setState({ titleSort: "Sort by views decrease" });
    } else if (sortType === sortTypes.SORT_VIEWS_INCREASED) {
      this.setState({ titleSort: "Sort By views increase" });
    }
    this.setState({
      listActionSort: {
        SORT_DAY_DECREASED: "Sort by day decrease",
        SORT_DAY_INCREASED: "Sort by day increase",
        SORT_PRICE_DECREASED: "Sort by price decrease",
        SORT_PRICE_INCREASED: "Sort by price increase",
        SORT_SALES_DECREASED: "Sort by sales decrease",
        SORT_SALES_INCREASED: "Sort by sales increase",
        SORT_VIEWS_DECREASED: "Sort by views decrease",
        SORT_VIEWS_INCREASED: "Sort By views increase",
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.sortType != this.props.sortType &&
      nextProps.sortType !== undefined
    ) {
      this.setState({
        titleSort: this.state.listActionSort[nextProps.sortType],
      });
    }
  }
  handeSearch = (e) => {
    if (e === 13) {
      this.props.searchTextSubmit();
    }
  };
  render() {
    return (
      <div className="header-bottom">
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div className="navbar-header">
                <button
                  type="button"
                  className="navbar-toggle"
                  data-toggle="collapse"
                  data-target=".navbar-collapse"
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
              </div>
              <div className="mainmenu pull-left">
                <ul className="nav navbar-nav collapse navbar-collapse">
                  <li>
                    <Link to="/" className="active">
                      Home
                    </Link>
                  </li>
                  <li className="dropdown">
                    <a href="#">
                      Shop<i className="fa fa-angle-down"></i>
                    </a>
                    <ul role="menu" className="sub-menu">
                      <li>
                        <a href="shop.html">Products</a>
                      </li>
                      <li>
                        <a href="product-details.html">Product Details</a>
                      </li>
                      <li>
                        <a href="checkout.html">Checkout</a>
                      </li>
                      <li>
                        <a href="cart.html">Cart</a>
                      </li>
                      <li>
                        <a href="login.html">Login</a>
                      </li>
                    </ul>
                  </li>
                  <li className="dropdown">
                    <a href="#">
                      Blog<i className="fa fa-angle-down"></i>
                    </a>
                    <ul role="menu" className="sub-menu">
                      <li>
                        <a href="blog.html">Blog List</a>
                      </li>
                      <li>
                        <a href="blog-single.html">Blog Single</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="contact-us.html">Contact</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="search_box pull-right">
                <input
                  type="text"
                  placeholder="Gõ từ khóa và Enter để tìm"
                  onChange={(e) => this.props.setSearchText(e.target.value)}
                  onKeyUp={(e) => this.handeSearch(e.keyCode)}
                  disabled={this.props.isDisabled}
                  value={this.props.text}
                />
              </div>
            </div>
            <div className="col-sm-2">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-default dropdown-toggle btn-custom"
                  data-toggle="dropdown"
                  disabled={this.props.isDisabled}
                >
                  {this.state.titleSort} <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" role="menu">
                  {Object.keys(this.state.listActionSort).map((key, index) => {
                    return (
                      <li onClick={() => this.props.setSortType(key)}>
                        <a>{this.state.listActionSort[key]}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default HeaderBottom;
