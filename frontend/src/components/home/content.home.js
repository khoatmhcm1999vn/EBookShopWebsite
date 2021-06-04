import React, { Component } from "react"
import ProductItem from "./product.item"
import { Link } from "react-router-dom"

class ContentHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: [],
      check_1: true,
      check_2: false,
      check_3: false,
      check_4: false,
      check_5: false,
      listPageSize: [10, 30, 50]
    }
  }
  componentWillMount() {
    let tmp = []
    for (let i = 1; i <= this.props.totalpage; i++) {
      tmp.push(i)
    }
    this.setState({ pagination: tmp })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.totalpage !== this.props.totalpage) {
      let tmp = []
      for (let i = 1; i <= nextProps.totalpage; i++) {
        tmp.push(i)
      }
      this.setState({ pagination: tmp })
    }
  }
  renderPagination() {
    if (this.state.pagination.length === 0) {
      return null
    } else {
      return (
        <ul className="pagination pagination-custom">
          <li onClick={() => this.props.backPage()}>
            <Link to="/shop">&laquo;</Link>
          </li>
          {this.state.pagination.map((element, index) => {
            if (this.props.page === element) {
              return (
                <li
                  className="active"
                  onClick={() => this.props.setPage(element)}
                >
                  <Link to="/shop">{element}</Link>
                </li>
              )
            } else {
              return (
                <li onClick={() => this.props.setPage(element)}>
                  <Link to="/shop">{element}</Link>
                </li>
              )
            }
          })}
          <li onClick={() => this.props.nextPage()}>
            <Link to="/shop">&raquo;</Link>
          </li>
        </ul>
      )
    }
  }
  resetCheck = () => {
    this.setState({
      check_1: false,
      check_2: false,
      check_3: false,
      check_4: false,
      check_5: false
    })
  }

  render() {
    // console.log(this.props.pageSize);
    // console.log(this.state.listPageSize);

    return (
      <section>
        <div>
          <div
            className="container"
            style={{ backgroundColor: "transparent!important" }}
          >
            <div className="mb-breadcrumbs">
              <div id="ves-breadcrumbs" className="breadcrumbs hidden-xs">
                <div className="container-inner breadcrumbs">
                  <ol className="breadcrumb">
                    <li className="home">
                      <Link to="/" title="Tới trang chủ">
                        Trang chủ
                      </Link>
                      <span>/</span>
                    </li>
                    <li className="category6719">
                      <strong>Shop Page</strong>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-3">
              <div className="left-sidebar">
                <h2>Reset</h2>
                <div className="panel-group category-products" id="accordian">
                  <div
                    key={1}
                    onClick={() => {
                      this.resetCheck()
                      this.props.setTitle("ALL BOOK")
                      this.props.setBranch("")
                      this.props.setSearchText("")
                      this.props.setIDBranch(null)
                      this.props.setRangeType(null)
                      // this.props.searchTextSubmit();
                      // this.props.setPageSize(10);
                    }}
                    className="panel panel-default"
                  >
                    <div className="panel-heading">
                      <h4 className="panel-title item-custom">
                        <a key={1}>Reset</a>
                      </h4>
                    </div>
                  </div>
                </div>
                <h2>Category</h2>
                <div className="panel-group category-products" id="accordian">
                  {this.props.category.map((element, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          // this.resetCheck();
                          this.props.setTitle(element.name)
                          this.props.setBranch("category")
                          this.props.setIDBranch(element._id)
                          this.props.branchClick("category", element._id)
                          // this.props.setPageSize(10);
                        }}
                        className="panel panel-default"
                      >
                        <div className="panel-heading">
                          <h4 className="panel-title item-custom">
                            <a key={index}>{element.name}</a>
                          </h4>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="brands_products">
                  <h2>Publisher</h2>
                  <div className="brands-name">
                    <ul className="nav nav-pills nav-stacked">
                      {this.props.publisher.map((element, index) => {
                        return (
                          <li
                            onClick={() => {
                              // this.resetCheck();
                              this.props.setTitle(element.name)
                              this.props.setBranch("publisher")
                              this.props.setIDBranch(element._id)
                              this.props.branchClick("publisher", element._id)
                            }}
                            className="item-custom"
                            item-custom
                          >
                            <a>
                              <span className="pull-right" />
                              {element.name}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
                <br />
                <div className="brands_products">
                  <h2>AUTHOR</h2>
                  <div className="brands-name">
                    <ul className="nav nav-pills nav-stacked">
                      {this.props.author.map((element, index) => {
                        return (
                          <li
                            onClick={() => {
                              // this.resetCheck();
                              this.props.setTitle(element.name)
                              this.props.setBranch("author")
                              this.props.setIDBranch(element._id)
                              this.props.branchClick("author", element._id)
                            }}
                            className="item-custom"
                            item-custom
                          >
                            <a>
                              <span className="pull-right" />
                              {element.name}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
                <div className="price-range">
                  <h2>Price Range</h2>
                  <div className="well ">
                    <div className="radio">
                      <label
                        onClick={() => {
                          this.props.setRangeType(null)
                          this.resetCheck()
                          this.setState({ check_1: true })
                        }}
                      >
                        <input
                          type="radio"
                          name="optradio"
                          checked={this.state.check_1}
                        />
                        All price
                      </label>
                    </div>
                    <div className="radio">
                      <label
                        onClick={() => {
                          this.props.setRangeType({ low: 0, high: 2000 })
                          this.resetCheck()
                          this.setState({ check_2: true })
                        }}
                      >
                        <input
                          type="radio"
                          name="optradio"
                          checked={this.state.check_2}
                        />
                        0 ---- 2000 USD
                      </label>
                    </div>
                    <div className="radio ">
                      <label
                        onClick={() => {
                          this.props.setRangeType({ low: 2000, high: 5000 })
                          this.resetCheck()
                          this.setState({ check_3: true })
                        }}
                      >
                        <input
                          type="radio"
                          name="optradio"
                          checked={this.state.check_3}
                        />
                        2000 ---- 5000 USD
                      </label>
                    </div>
                    <div className="radio ">
                      <label
                        onClick={() => {
                          this.resetCheck()
                          this.setState({ check_4: true })
                          this.props.setRangeType({ low: 5000, high: 10000 })
                        }}
                      >
                        <input
                          type="radio"
                          name="optradio"
                          checked={this.state.check_4}
                        />
                        5000 ---- 10000 USD
                      </label>
                    </div>
                    <div className="radio ">
                      <label
                        onClick={() => {
                          this.props.setRangeType({ low: 10000, high: 100000 })
                          this.resetCheck()
                          this.setState({ check_5: true })
                        }}
                      >
                        <input
                          type="radio"
                          name="optradio"
                          checked={this.state.check_5}
                        />
                        10000 ---- 100000 USD
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-9 padding-right">
              <div className="" style={{ marginRight: "40rem" }}>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-default dropdown-toggle btn-custom"
                    data-toggle="dropdown"
                    disabled={this.props.isDisabled}
                  >
                    {this.props.pageSize} <span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu" role="menu">
                    {Object.keys(this.state.listPageSize).map((key, index) => {
                      return (
                        <li
                          onClick={() =>
                            this.props.setPageSize(this.state.listPageSize[key])
                          }
                        >
                          <a>{this.state.listPageSize[key]}</a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
              {/* <h3> {this.state.listPageSize[key]}</h3>; */}

              <div className="features_items">
                <h2 className="title text-center">
                  {this.props.branch} {this.props.title}
                </h2>
                {this.props.book.map((element, index) => {
                  return (
                    <ProductItem
                      key={index}
                      book={element}
                      urlImg={element.img}
                      price={element.price}
                      describe={element.describe}
                      id={element._id}
                      addToCart={product => this.props.addToCart(product)}
                    />
                  )
                })}
              </div>
              <div>{this.renderPagination()}</div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
export default ContentHome
