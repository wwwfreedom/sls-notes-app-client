import React from "react"
import { Route, Redirect } from "react-router-dom"

// if user is not authenticated render the component otherwise redirect to homepage
export default ({ component: C, props: cProps, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !cProps.isAuthenticated ? (
        <C {...props} {...cProps} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
)
