import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="main-footer">
        <div className="float-right d-none d-sm-block">
          <b>Version</b> 3.0.4
        </div>
        <strong>
          Copyright © 2020-2021 <a href="http://khoa.io">Book Shop Web</a>.
        </strong>{" "}
        All rights reserved by Vladimir Khoa.
      </footer>
    );
  }
}

export default Footer;
