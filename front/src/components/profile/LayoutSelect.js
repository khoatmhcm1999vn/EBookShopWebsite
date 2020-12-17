import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../auth";

import AdminLayout from "../../AdminLayout/AdminLayout";
import Layout from "../../Layout/Layout";

const LayoutSelect = ({ component: Component, ...rest }) => (
  <Component
    {...rest}
    render={(props) =>
      isAuthenticated() &&
      isAuthenticated().user.roles.includes("ROLE_ADMIN") ? (
        <AdminLayout {...props} />
      ) : (
        <Layout {...props} />
      )
    }
  />
);

export default LayoutSelect;
