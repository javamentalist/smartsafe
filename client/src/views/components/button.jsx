import React from 'react'
import ReactDOM from 'react-dom'

export default class Button extends React.Component {

  render() {
    return (
      <button className={`btn btn-large ${this.props.buttonClass}`} onClick={this.props.onClick}>
        {this.props.iconClass &&
          <span className={`icon icon-${this.props.iconClass}`}></span>
        }
        {this.props.text}
      </button>
    )
  }
}

Button.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  buttonClass: React.PropTypes.string,
  iconClass: React.PropTypes.string,
  text: React.PropTypes.string
}

Button.defaultProps = {
  buttonClass: 'btn-primary'
}