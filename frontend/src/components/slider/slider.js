import React, { Component } from "react"
import { Link } from "react-router-dom"

class Slider extends Component {
  render() {
    return (
      <div id="sidebar" className="nav-collapse ">
        <ul className="sidebar-menu">
          {this.props.activateHome ? (
            <li className="active">
              <Link className="" to="/dashboard">
                <i className="icon_house_alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>
          ) : (
            <li className="">
              <Link className="" to="/dashboard">
                <i className="icon_house_alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>
          )}
          {this.props.activateSupport ? (
            <li>
              <Link className="active" to="/support">
                <i className="icon_genius"></i>
                <span>Support</span>
              </Link>
            </li>
          ) : (
            <li>
              <Link className="" to="/support">
                <i className="icon_genius"></i>
                <span>Support</span>
              </Link>
            </li>
          )}
          {this.props.activateStatistical ? (
            <li>
              <Link className="active" to="/statistical">
                <i className="icon_genius"></i>
                <span>Statistical</span>
              </Link>
            </li>
          ) : (
            <li>
              <Link className="" to="/statistical">
                <i className="icon_genius"></i>
                <span>Statistical</span>
              </Link>
            </li>
          )}
          <li className="dropdown">
            <a data-toggle="dropdown" className="" href="#">
              {/* <span className="profile-ava">
                <img alt="" src="img/avatar1_small.jpg" />
              </span> */}
              <i className="icon_document_alt"></i>
              <span className="username">Manager</span>
              <b className="caret"></b>
            </a>
            <ul className="dropdown-menu extended logout">
              <div className="log-arrow-up"></div>
              <li className="eborder-top">
                <Link className="" to="/bookmanager">
                  Book
                </Link>
              </li>
              <li>
                <Link className="" to="/categorymanager">
                  Category
                </Link>
              </li>
              <li>
                <Link className="" to="/publishermanager">
                  Publisher
                </Link>
              </li>
              <li>
                <Link className="" to="/authormanager">
                  Author
                </Link>
              </li>
              <li>
                <Link className="" to="/usermanager">
                  User
                </Link>
              </li>
              <li>
                <Link className="" to="/billmanager">
                  Bill
                </Link>
              </li>

              {/* <li>
                <Link className="" to="/support">
                  <i className="icon_genius"></i>
                  <span>Support</span>
                </Link>
              </li>
              <li>
                <a href="documentation.html">
                  <i className="icon_key_alt"></i> Documentation
                </a>
              </li>
              <li>
                <a href="documentation.html">
                  <i className="icon_key_alt"></i> Documentation
                </a>
              </li> */}
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}
export default Slider

// <li className="sub-menu">
//   <a href="javascript:" className="">
//     <i className="icon_document_alt"></i>
//     <span>Manager</span>
//     <span className="menu-arrow arrow_carrot-right"></span>
//   </a>
//   <ul className="sub">
//     <li>
//       <a className="" href="/bookmanager">
//         Book{" "}
//       </a>
//     </li>
//   </ul>
// </li>
//  <li className="sub-menu">
//   <a href="javascript:;" className="">
//     <i className="icon_desktop"></i>
//     <span>UI Fitures</span>
//     <span className="menu-arrow arrow_carrot-right"></span>
//   </a>
//   <ul className="sub">
//     <li>
//       <a className="" href="general.html">
//         Elements
//       </a>
//     </li>
//     <li>
//       <a className="" href="buttons.html">
//         Buttons
//       </a>
//     </li>
//     <li>
//       <a className="" href="grids.html">
//         Grids
//       </a>
//     </li>
//   </ul>
// </li>

//  <li>
//   <a className="" href="chart-chartjs.html">
//     <i className="icon_piechart"></i>
//     <span>Charts</span>
//   </a>
// </li>
// <li className="sub-menu">
//   <a href="javascript:;" className="">
//     <i className="icon_table"></i>
//     <span>Tables</span>
//     <span className="menu-arrow arrow_carrot-right"></span>
//   </a>
//   <ul className="sub">
//     <li>
//       <a className="" href="basic_table.html">
//         Basic Table
//       </a>
//     </li>
//   </ul>
// </li>
// <li className="sub-menu">
//   <a href="javascript:;" className="">
//     <i className="icon_documents_alt"></i>
//     <span>Pages</span>
//     <span className="menu-arrow arrow_carrot-right"></span>
//   </a>
//   <ul className="sub">
//     <li>
//       <a className="" href="profile.html">
//         Profile
//       </a>
//     </li>
//     <li>
//       <a className="" href="login.html">
//         <span>Login Page</span>
//       </a>
//     </li>
//     <li>
//       <a className="" href="contact.html">
//         <span>Contact Page</span>
//       </a>
//     </li>
//     <li>
//       <a className="" href="blank.html">
//         Blank Page
//       </a>
//     </li>
//     <li>
//       <a className="" href="404.html">
//         404 Error
//       </a>
//     </li>
//   </ul>
// </li>
