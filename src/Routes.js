import React from "react"
import { Route, Switch } from "react-router-dom"
import AppliedRoute from "./components/AppliedRoute.js"
import Home from "./containers/Home"
import Login from "./containers/Login.js"
import NotFound from "./containers/NotFound.js"
import Signup from "./containers/Signup"
import ConfirmSignup from "./containers/ConfirmSignup"
import NewNote from "./containers/NewNote.js"
import Notes from "./containers/Notes"
import AuthenticatedRoute from "./components/AuthenticatedRoute"
import UnauthenticatedRoute from "./components/UnauthenticatedRoute"

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={Login}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/signup"
      exact
      component={Signup}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/confirm-signup/:userEmail"
      exact
      component={ConfirmSignup}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/new"
      exact
      component={NewNote}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/:id"
      exact
      component={Notes}
      props={childProps}
    />
    {/* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>
)
