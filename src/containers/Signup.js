import React, { Component } from "react"
import { Auth } from "aws-amplify"
import {
  HelpBlock,
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
      confirmationCode: "",
      newUser: null,
    }
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    )
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    })
  }

  // the logic here is a bit flaw, if user refresh during confirmation page then when they go to login in the next time, aws amplify would say that the user has not veryify. it is only then you would show the the handle confirmation. a better logic would be to have the confirmation in a separate route so it's decouple from the state in the signup form.
  // to do tomorrow separate the confirmation into a seperate route.
  handleSubmit = async event => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password,
      })
      this.setState({ newUser })
    } catch (e) {
      if (e.code === "UsernameExistsException") {
        Auth.resendSignUp(this.state.email).then(() => {
          this.setState({
            newUser: {
              username: this.state.email,
            },
          })
        })
      }

      alert(e.message)
    }

    this.setState({ isLoading: false })
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode)
      await Auth.signIn(this.state.email, this.state.password)

      this.props.userHasAuthenticated(true)
      this.props.history.push("/")
    } catch (e) {
      alert(e.message)
      this.setState({ isLoading: false })
    }
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    )
  }

  renderForm() {
    return (
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
    )
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    )
  }
}
