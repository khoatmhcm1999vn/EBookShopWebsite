import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "../core/Menu";
import classes from "./Layout.css";

import Cart from "../Cart/Cart";

// state cart value

const Layout = ({
  title = "Title",
  description = "Description",
  className,
  children,
}) => {
  const cart = useSelector((state) => state.cart);

  return (
    <div>
      <Menu />
      <div className="jumbotron">
        {/* <div>
          <a href={`/cart`} className="cart">
            <Cart count={Object.keys(cart.cartItems).length} />
            <span style={{ margin: "0 10px" }}>Cart</span>
          </a>
        </div> */}
        <h2>{title}</h2>
        <p className="lead">{description}</p>
      </div>
      <div className={className}>{children}</div>
    </div>

    // // <div>
    // //   <Menu />

    //   {/* <Fragment>
    //     <header className={classes.Layout__main__header}>{props.header}</header>
    //     {props.mobileNav}

    //     <main className={classes.Layout__content}>{props.children}</main>
    //   </Fragment> */}

    //   {/* <div className={classes.Layout}>
    //     <h2 className={classes.abc}>{title}</h2>
    //     <p className="lead">{description}</p>
    //   </div>
    //   <div className={className}>{children}</div> */}

    //   {/* <div className={`jumbotron $={classes.Layout}`}> */}
    // </div>
  );
};
export default Layout;
