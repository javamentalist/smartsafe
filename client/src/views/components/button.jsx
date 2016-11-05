import React from 'react'
import ReactDOM from 'react-dom'


const Button = ({buttonClass, iconClass, text, onClick}) => (
  <button className={`btn btn-large ${buttonClass}`} onClick={onClick}>
    {iconClass &&
      <span className={`icon icon-${iconClass}`}></span>
    }
    {text}
  </button>
)

Button.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  buttonClass: React.PropTypes.string,
  iconClass: React.PropTypes.string,
  text: React.PropTypes.string
}

Button.defaultProps = {
  buttonClass: 'btn-primary'
}

export default Button