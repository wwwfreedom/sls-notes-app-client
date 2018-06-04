import React from "react"
import { Route, Redirect } from "react-router-dom"

// explanations of the passing more props to the Routes component from react-router
// The Route component takes a prop called component that represents the component that will be rendered when a matching route is found. We want our childProps to be sent to this component.
// The Route component can also take a render method in place of the component. This allows us to control what is passed in to our component.
// Based on this we can create a component that returns a Route and takes a component and childProps prop. This allows us to pass in the component we want rendered and the props that we want applied.
// Finally, we take component (set as C) and props (set as cProps) and render inside our Route using the inline function; props => <C {...props} {...cProps} />. Note, the props variable in this case is what the Route component passes us. Whereas, the cProps is the childProps that want to set.

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
