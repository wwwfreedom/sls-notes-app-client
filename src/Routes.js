import React from "react"
import { Route, Switch } from "react-router-dom"
import AppliedRoute from "./components/AppliedRoute.js"
import Home from "./containers/Home"
import Login from "./containers/Login.js"
import NotFound from "./containers/NotFound.js"
import Signup from "./containers/Signup"
import ConfirmSignup from "./containers/ConfirmSignup"
import NewNote from "./containers/NewNote.js"

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute
      path="/confirm-signup/:userEmail"
      exact
      component={ConfirmSignup}
      props={childProps}
    />
    <AppliedRoute
      path="/notes/new"
      exact
      component={NewNote}
      props={childProps}
    />
    {/* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>
)
