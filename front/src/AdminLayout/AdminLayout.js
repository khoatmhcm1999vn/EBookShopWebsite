import React from "react";
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
);

export default AdminLayout;
