import React, { Component } from "react"
import { API, Storage } from "aws-amplify"
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap"
import LoaderButton from "../components/LoaderButton"
import { s3Upload } from "../libs/awsLib"
import config from "../config"
import "./Notes.css"

export default class Notes extends Component {
  constructor(props) {
    super(props)

    this.file = null

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: "",
      attachmentURL: null,
    }
  }

  // call aws to get note on componentDidMount
  async componentDidMount() {
    try {
      let attachmentURL
      const note = await this.getNote()
      const { content, attachment } = note

      if (attachment) {
        // this return the key to get to the object in s3
        attachmentURL = await Storage.vault.get(attachment)
      }

      this.setState({
        note,
        content,
        attachmentURL,
      })
    } catch (e) {
      alert(e)
    }
  }

  saveNote(note) {
    return API.put("notes", `/notes/${this.props.match.params.id}`, {
      body: note,
    })
  }

  deleteNote() {
    return API.del("notes", `/notes/${this.props.match.params.id}`)
  }

  getNote() {
    return API.get("notes", `/notes/${this.props.match.params.id}`)
  }

  validateForm() {
    return this.state.content.length > 0
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "")
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    })
  }

  handleFileChange = event => {
    this.file = event.target.files[0]
  }

  handleSubmit = async event => {
    let attachment
    const { attachmentURL } = this.state

    event.preventDefault()

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB")
      return
    }

    this.setState({ isLoading: true })

    try {
      if (this.file) {
        // remove existing file if there's is existing file if theres attachmentURL then there is an existing file
        if (attachmentURL) {
          await Storage.vault.remove(this.state.note.attachment)
        }
        attachment = await s3Upload(this.file)
      }

      await this.saveNote({
        content: this.state.content,
        attachment: attachment || this.state.note.attachment,
      })
      this.props.history.push("/")
    } catch (e) {
      alert(e)
      this.setState({ isLoading: false })
    }
  }

  handleDelete = async event => {
    event.preventDefault()

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    )

    if (!confirmed) {
      return
    }

    this.setState({ isDeleting: true })

    try {
      await this.deleteNote()
      if (this.state.attachmentURL) {
        await Storage.vault.remove(this.state.note.attachment)
      }
      this.props.history.push("/")
    } catch (e) {
      alert(e)
      this.setState({ isDeleting: false })
    }
  }

  render() {
    const { note, attachmentURL, isLoading, isDeleting } = this.state
    return (
      <div className="Notes">
        {note && (
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
              />
            </FormGroup>
            {note.attachment && (
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={attachmentURL}
                  >
                    {this.formatFilename(note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>
            )}
            <FormGroup controlId="file">
              {!note.attachment && <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>
        )}
      </div>
    )
  }
}
