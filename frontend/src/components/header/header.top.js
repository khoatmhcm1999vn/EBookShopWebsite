import React from "react"
import { Link } from "react-router-dom"

const HeaderTop = () => (
  <div className="header_top">
    <div className="container">
      <div className="row">
        <div className="col-sm-6">
          <div className="contactinfo">
            <ul className="nav nav-pills">
              <li>
                <Link to="/">
                  <i className="fa fa-phone"></i> +09 11 32 11 23
                </Link>
              </li>
              <li>
                <Link to="/">
                  <i className="fa fa-envelope"></i> bookshop@domain.com
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="social-icons pull-right">
            <ul className="nav navbar-nav">
              <li>
                <a target="_blank" rel="noreferrer" href="https://facebook.com">
                  <i className="fa fa-facebook"></i>
                </a>
              </li>
              <li>
                <a target="_blank" rel="noreferrer" href="https://twitter.com/">
                  <i className="fa fa-twitter"></i>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.youtube.com/"
                >
                  <i className="fa fa-youtube"></i>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.linkedin.com/"
                >
                  <i className="fa fa-linkedin"></i>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://dribbble.com/"
                >
                  <i className="fa fa-dribbble"></i>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://myaccount.google.com/"
                >
                  <i className="fa fa-google-plus"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default HeaderTop
