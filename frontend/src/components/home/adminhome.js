import React, { Component } from "react"
import DashboardScreen from "../../screens/DashboardScreen"

class AdminHome extends Component {
  constructor() {
    super()
    this.state = {
      sum: 100
    }
  }
  tinh(count) {
    return (count / this.state.sum) * 100 + "%"
  }
  render() {
    // console.log(this.props.top_product);
    return (
      <div>
        <section id="main-content">
          <section className="wrapper">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="page-header">
                  <i className="fa fa-laptop" /> Dashboard
                </h3>
                <ol className="breadcrumb">
                  <li>
                    <i className="fa fa-home" />
                    <a href="/dashboard">Home</a>
                  </li>
                  <li>
                    <i className="fa fa-laptop" />
                    Dashboard
                  </li>
                </ol>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                <div className="info-box blue-bg">
                  <i className="fa fa-cloud-download" />
                  <div className="count">6.674</div>
                  <div className="title">Download</div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                <div className="info-box brown-bg">
                  <i className="fa fa-shopping-cart" />
                  <div className="count">{this.props.countProductBill}</div>
                  <div className="title">Purchased</div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                <div className="info-box dark-bg">
                  <i className="fa fa-thumbs-o-up" />
                  <div className="count">{this.props.countBill}</div>
                  <div className="title">Order</div>
                </div>
              </div>

              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                <div className="info-box green-bg">
                  <i className="fa fa-cubes" />
                  <div className="count">{this.props.countProductStock}</div>
                  <div className="title">Stock</div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-9 col-md-12">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h2>
                      <i className="fa fa-map-marker red" />
                      <strong>Countries</strong>
                    </h2>
                    <div className="panel-actions">
                      <a href="index.html#" className="btn-setting">
                        <i className="fa fa-rotate-right" />
                      </a>
                      <a href="index.html#" className="btn-minimize">
                        <i className="fa fa-chevron-up" />
                      </a>
                      <a href="index.html#" className="btn-close">
                        <i className="fa fa-times" />
                      </a>
                    </div>
                  </div>
                  <div className="panel-body-map">
                    <div id="map" style={{ height: "380px" }} />
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <ul className="today-datas">
                  <li>
                    <div>
                      <span id="todayspark1" className="spark" />
                    </div>

                    <div className="datas-text">11,500 visitors/day</div>
                  </li>
                  <li>
                    <div>
                      <span id="todayspark2" className="spark" />
                    </div>
                    <div className="datas-text">15,000 Pageviews</div>
                  </li>
                  <li>
                    <div>
                      <span id="todayspark3" className="spark" />
                    </div>
                    <div className="datas-text">30.55% Bounce Rate</div>
                  </li>
                  <li>
                    <div>
                      <span id="todayspark4" className="spark" />
                    </div>
                    <div className="datas-text">$16,00 Revenue/Day</div>
                  </li>
                  <li>
                    <div>
                      <span id="todayspark5" className="spark" />
                    </div>
                    <div className="datas-text">
                      12,000000 visitors every Month
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-9 col-md-12">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h2>
                      <i className="fa fa-flag-o red" />
                      <strong>
                        Digital sales number(percent percentage of 1000
                        products)
                      </strong>
                    </h2>
                    <div className="panel-actions">
                      <a href="index.html#" className="btn-setting">
                        <i className="fa fa-rotate-right" />
                      </a>
                      <a href="index.html#" className="btn-minimize">
                        <i className="fa fa-chevron-up" />
                      </a>
                      <a href="index.html#" className="btn-close">
                        <i className="fa fa-times" />
                      </a>
                    </div>
                  </div>
                  <DashboardScreen />
                  <div className="panel-body">
                    <table className="table bootstrap-datatable countries">
                      <thead>
                        <tr>
                          <th />
                          <th>Name</th>
                          <th>Price</th>
                          <th>Sales number</th>
                          <th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.top_product.map((element, index) => {
                          return (
                            <tr>
                              <td>
                                <img
                                  src={element.img}
                                  style={{ height: "18px", marginTop: "-2px" }}
                                />
                              </td>
                              <td>{element.name}</td>
                              <td>{element.price}</td>
                              <td>{element.count}</td>
                              <td>
                                <div className="progress thin">
                                  <div
                                    className="progress-bar progress-bar-danger"
                                    role="progressbar"
                                    aria-valuenow="80"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{ width: this.tinh(element.count) }}
                                  />
                                </div>
                                <span className="sr-only">73%</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="social-box facebook">
                  <i className="fa fa-facebook" />
                  <ul>
                    <li>
                      <strong>256k</strong>
                      <span>friends</span>
                    </li>
                    <li>
                      <strong>359</strong>
                      <span>feeds</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3">
                <div className="social-box google-plus">
                  <i className="fa fa-google-plus" />
                  <ul>
                    <li>
                      <strong>962</strong>
                      <span>followers</span>
                    </li>
                    <li>
                      <strong>256</strong>
                      <span>circles</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3">
                <div className="social-box twitter">
                  <i className="fa fa-twitter" />
                  <ul>
                    <li>
                      <strong>1562k</strong>
                      <span>followers</span>
                    </li>
                    <li>
                      <strong>2562</strong>
                      <span>tweets</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 portlets">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <div className="pull-left">Message</div>
                    <div className="widget-icons pull-right">
                      <a href="#" className="wminimize">
                        <i className="fa fa-chevron-up" />
                      </a>
                      <a href="#" className="wclose">
                        <i className="fa fa-times" />
                      </a>
                    </div>
                    <div className="clearfix" />
                  </div>

                  <div className="panel-body">
                    <div className="padd sscroll">
                      <ul className="chats">
                        <li className="by-me">
                          <div className="avatar pull-left">
                            <img src="img/user.jpg" alt="" />
                          </div>

                          <div className="chat-content">
                            <div className="chat-meta">
                              John Smith{" "}
                              <span className="pull-right">3 hours ago</span>
                            </div>
                            Vivamus diam elit diam, consectetur dapibus
                            adipiscing elit.
                            <div className="clearfix" />
                          </div>
                        </li>
                        <li className="by-other">
                          <div className="avatar pull-right">
                            <img src="img/user22.png" alt="" />
                          </div>

                          <div className="chat-content">
                            <div className="chat-meta">
                              3 hours ago{" "}
                              <span className="pull-right">Jenifer Smith</span>
                            </div>
                            Vivamus diam elit diam, consectetur fconsectetur
                            dapibus adipiscing elit.
                            <div className="clearfix" />
                          </div>
                        </li>

                        <li className="by-me">
                          <div className="avatar pull-left">
                            <img src="img/user.jpg" alt="" />
                          </div>

                          <div className="chat-content">
                            <div className="chat-meta">
                              John Smith{" "}
                              <span className="pull-right">4 hours ago</span>
                            </div>
                            Vivamus diam elit diam, consectetur fermentum sed
                            dapibus eget, Vivamus consectetur dapibus adipiscing
                            elit.
                            <div className="clearfix" />
                          </div>
                        </li>

                        <li className="by-other">
                          <div className="avatar pull-right">
                            <img src="img/user22.png" alt="" />
                          </div>

                          <div className="chat-content">
                            <div className="chat-meta">
                              3 hours ago{" "}
                              <span className="pull-right">Jenifer Smith</span>
                            </div>
                            Vivamus diam elit diam, consectetur fermentum sed
                            dapibus eget, Vivamus consectetur dapibus adipiscing
                            elit.
                            <div className="clearfix" />
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="widget-foot">
                      <form className="form-inline">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type your message here..."
                          />
                        </div>
                        <button type="submit" className="btn btn-info">
                          Send
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <section className="panel">
                  <div className="panel-body progress-panel">
                    <div className="row">
                      <div className="col-lg-8 task-progress pull-left">
                        <h1>To Do Everyday</h1>
                      </div>
                      <div className="col-lg-4">
                        <span className="profile-ava pull-right">
                          <img
                            alt=""
                            className="simple"
                            src="img/avatar1_small.jpg"
                          />
                          Jenifer smith
                        </span>
                      </div>
                    </div>
                  </div>
                  <table className="table table-hover personal-task">
                    <tbody>
                      <tr>
                        <td>Today</td>
                        <td>web design</td>
                        <td>
                          <span className="badge bg-important">Upload</span>
                        </td>
                        <td>
                          <span className="profile-ava">
                            <img
                              alt=""
                              className="simple"
                              src="img/avatar1_small.jpg"
                            />
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Yesterday</td>
                        <td>Project Design Task</td>
                        <td>
                          <span className="badge bg-success">Task</span>
                        </td>
                        <td>
                          <div id="work-progress2" />
                        </td>
                      </tr>
                      <tr>
                        <td>21-10-14</td>
                        <td>Generate Invoice</td>
                        <td>
                          <span className="badge bg-success">Task</span>
                        </td>
                        <td>
                          <div id="work-progress3" />
                        </td>
                      </tr>
                      <tr>
                        <td>22-10-14</td>
                        <td>Project Testing</td>
                        <td>
                          <span className="badge bg-primary">To-Do</span>
                        </td>
                        <td>
                          <span className="profile-ava">
                            <img
                              alt=""
                              className="simple"
                              src="img/avatar1_small.jpg"
                            />
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>24-10-14</td>
                        <td>Project Release Date</td>
                        <td>
                          <span className="badge bg-info">Milestone</span>
                        </td>
                        <td>
                          <div id="work-progress4" />
                        </td>
                      </tr>
                      <tr>
                        <td>28-10-14</td>
                        <td>Project Release Date</td>
                        <td>
                          <span className="badge bg-primary">To-Do</span>
                        </td>
                        <td>
                          <div id="work-progress5" />
                        </td>
                      </tr>
                      <tr>
                        <td>Last week</td>
                        <td>Project Release Date</td>
                        <td>
                          <span className="badge bg-primary">To-Do</span>
                        </td>
                        <td>
                          <div id="work-progress1" />
                        </td>
                      </tr>
                      <tr>
                        <td>last month</td>
                        <td>Project Release Date</td>
                        <td>
                          <span className="badge bg-success">To-Do</span>
                        </td>
                        <td>
                          <span className="profile-ava">
                            <img
                              alt=""
                              className="simple"
                              src="img/avatar1_small.jpg"
                            />
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </div>
            </div>
            <br />
            <br />

            <div className="row">
              <div className="col-md-6 portlets">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h2>
                      <strong>Calendar</strong>
                    </h2>
                    <div className="panel-actions">
                      <a href="#" className="wminimize">
                        <i className="fa fa-chevron-up" />
                      </a>
                      <a href="#" className="wclose">
                        <i className="fa fa-times" />
                      </a>
                    </div>
                  </div>
                  <br />
                  <br />
                  <br />
                  <div className="panel-body">
                    <div id="calendar" />
                  </div>

                  <div className="col-md-6 portlets">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <div className="pull-left">Quick Post</div>
                        <div className="widget-icons pull-right">
                          <a href="#" className="wminimize">
                            <i className="fa fa-chevron-up" />
                          </a>
                          <a href="#" className="wclose">
                            <i className="fa fa-times" />
                          </a>
                        </div>
                        <div className="clearfix" />
                      </div>
                      <div className="panel-body">
                        <div className="padd">
                          <div className="form quick-post">
                            <form className="form-horizontal">
                              <div className="form-group">
                                <label
                                  className="control-label col-lg-2"
                                  for="title"
                                >
                                  Title
                                </label>
                                <div className="col-lg-10">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <label
                                  className="control-label col-lg-2"
                                  for="content"
                                >
                                  Content
                                </label>
                                <div className="col-lg-10">
                                  <textarea
                                    className="form-control"
                                    id="content"
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="control-label col-lg-2">
                                  Category
                                </label>
                                <div className="col-lg-10">
                                  <select className="form-control">
                                    <option value="">
                                      - Choose Cateogry -
                                    </option>
                                    <option value="1">General</option>
                                    <option value="2">News</option>
                                    <option value="3">Media</option>
                                    <option value="4">Funny</option>
                                  </select>
                                </div>
                              </div>
                              <div className="form-group">
                                <label
                                  className="control-label col-lg-2"
                                  for="tags"
                                >
                                  Tags
                                </label>
                                <div className="col-lg-10">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="tags"
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="col-lg-offset-2 col-lg-9">
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                  >
                                    Publish
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn btn-danger"
                                  >
                                    Save Draft
                                  </button>
                                  <button
                                    type="reset"
                                    className="btn btn-default"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div className="widget-foot" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="text-right">
            <div className="credits">
              <a href="https://bootstrapmade.com/">Free Bootstrap Templates</a>
              &nbsp;by <a href="https://bootstrapmade.com/">BootstrapMade</a>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
export default AdminHome
