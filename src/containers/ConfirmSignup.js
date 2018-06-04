import React, { Component } from "react"
import { Auth } from "aws-amplify"
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
} from "react-bootstrap"
import LoaderButton from "../components/LoaderButton"
import "./ConfirmSignup.css"

export default class ConfirmSignup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      confirmationCode: "",
    }
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    })
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault()
    const {match: {params: {userEmail}}} = this.props

    this.setState({ isLoading: true })

    try {
      if (userEmail) {
        await Auth.confirmSignUp(userEmail, this.state.confirmationCode)
      }
      this.props.history.push("/login")
    } catch (e) {
      alert(e.message)
      this.setState({ isLoading: false })
    }
  }

  render() {
    return (
      <div className="ConfirmSignup">
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
      </div>
    )
  }
}
