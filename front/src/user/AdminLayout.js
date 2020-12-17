import React, { Fragment } from "react";
import AdminMenu from "../AdminMenu/AdminMenu";


const AdminLayout = ({
  title = "Title",
  description = "Description",
  className,
  children,
}) => (
  <div>
    <AdminMenu />
    <div className="jumbotron">
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

export default AdminLayout;
