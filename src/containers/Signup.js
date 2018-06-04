import React, { Component } from "react"
import { Auth } from "aws-amplify"
import {
  FormGroup,
  FormControl,
  ControlLabel,
} from "react-bootstrap"
import LoaderButton from "../components/LoaderButton"
import "./Signup.css"

export default class Signup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
    }
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    )
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    })
  }

  handleSubmit = async event => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await Auth.signUp({
        username: this.state.email,
        password: this.state.password,
      }).then(() => {
        this.props.history.push(`confirm-signup/${this.state.email}`)
      })
    } catch (e) {
      if (e.code === "UsernameExistsException") {
        this.props.history.push("/login")
      }
      alert(e.message)
    }

    this.setState({ isLoading: false })
  }

  render() {
    return (
      <div className="Signup">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Signup"
            loadingText="Signing up…"
          />
        </form>
      </div>
    )
  }
}
