import React from "react"
import { Route, Redirect } from "react-router-dom"

function querystring(name, url = window.location.href) {
  console.log(url, 'url')
  console.log("name", name);
  name = name.replace(/[[]]/g, "\\$&")
  console.log("name", name);

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  // exec method execute a search for a match in a specified string => a result array or null
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// if user is not authenticated render the component otherwise redirect to homepage
export default ({ component: C, props: cProps, ...rest }) => {
  const redirect = querystring("redirect");
  return (
    <Route
      {...rest}
      render={props =>
        !cProps.isAuthenticated
                   ? <C {...props} {...cProps} />
                   : <Redirect
                       to={redirect === "" || redirect === null ? "/" : redirect}
                   />}
    />
  );
};

