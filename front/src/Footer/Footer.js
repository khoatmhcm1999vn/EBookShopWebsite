import React, { Fragment } from "react";

import classes from "./Footer.css";

const Footer = ({
  //   title = "Title",
  //   description = "Description",
  className,
  children,
}) => (
  <footer className="bg-dark p-2 fixed-bottom">
    <div className="container-fluid text-white">
      <div className="row">
        <div className="col-6">
          <p className="mb-0 ">
            Copyright &copy; 2020 All Rights Reserved by Book Shop Web!
          </p>
        </div>
        <div className="col-6 d-flex justify-content-center align-items-center">
          <div className="mr-3">
            <i className="fab fa-facebook "></i>
          </div>
          <div className="mr-3">
            <i className="fab fa-linkedin"></i>
          </div>
          <div className="mr-3">
            <i className="fab fa-dribbble"></i>
          </div>
          <div className="mr-3">
            <i className="fab fa-instagram"></i>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
