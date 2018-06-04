import React from "react"
import { Route, Redirect } from "react-router-dom"

export default ({ component: C, props: cProps, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      console.log(props.location.pathname, "pathname")
      console.log(props.location.search, "search")
      return cProps.isAuthenticated ? (
        <C {...props} {...cProps} />
      ) : (
        <Redirect
          to={`/login?redirect=${props.location.pathname}${
            props.location.search
          }`}
        />
      )
    }}
  />
)
