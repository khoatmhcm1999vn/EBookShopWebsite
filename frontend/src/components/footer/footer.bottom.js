import React from "react";
import Scroll from "../scroll/Scroll";

const FooterBottom = () => (
  <>
    <Scroll showBelow={400} />
    <div className="footer-bottom">
      <div className="container">
        <div className="row">
          <p className="pull-left">
            Copyright © 2021 E-BOOK-SHOPPER Inc. All rights reserved.
          </p>
          <p className="pull-right">
            Designed by{" "}
            <span>
              <a href="#">Bookshop</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  </>
);
export default FooterBottom;
