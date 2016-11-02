import React from 'react'
import ReactDOM from 'react-dom'

export default class AddFileButton extends React.Component {

  render() {
    return (
      <button className="btn btn-large btn-primary">
        <span className="icon icon-plus"></span>
        Add new file
      </button>
    )
  }
}
