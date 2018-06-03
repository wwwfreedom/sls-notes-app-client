import React, { Component, Fragment } from "react"
import { Auth } from "aws-amplify"
import { LinkContainer } from "react-router-bootstrap"
import { Link, withRouter } from "react-router-dom"
import { Nav, Navbar, NavItem } from "react-bootstrap"
import Routes from "./Routes.js"
import "./App.css"

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
    }
  }

  //  check if a session object is returned. If so, then it updates the isAuthenticating flag once the process is complete. Also, the Auth.currentSession() method throws an error No current user if nobody is currently logged in. We don’t want to show this error to users when they load up our app and are not signed in
  async componentDidMount() {
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true)
      }
    } catch (e) {
      if (e !== "No current user") {
        alert(e)
      }
    }

    this.setState({ isAuthenticating: false })
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated })
  }

  handleLogout = async event => {
    // once logged in via aws amplify the user session is stored in local storage
    // when we refresh the page we load the user session again

    // wait for the signout to resolve then call it.
    // this clear out the user session in local storage
    await Auth.signOut()
    this.userHasAuthenticated(false)
    this.props.history.push("/login")
  }

  render() {
    const { isAuthenticated, isAuthenticating } = this.state
    const childProps = {
      isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
    }

    return (
      /* loading user session is an asynchornous process so only render when the is authenticating is done */
      isAuthenticating === false && (
        <div className="App container">
          <Navbar fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Scratch</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                {isAuthenticated ? (
                  <NavItem onClick={this.handleLogout}>Logout</NavItem>
                ) : (
                  <Fragment>
                    <LinkContainer to="/signup">
                      <NavItem>Signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </Fragment>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </div>
      )
    )
  }
}

export default withRouter(App)
