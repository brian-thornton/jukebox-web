import React from 'react';
import { PropTypes } from 'prop-types';
import { Button as ReactButton } from 'react-bootstrap';
import { Style } from './shapes';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  content: PropTypes.string,
  style: Style.isRequired,
};

function Button({ onClick, content, style }) {
  return <ReactButton style={style} className="button" variant="outline-light" onClick={onClick}>{content}</ReactButton>;
}

Button.propTypes = propTypes;

Button.defaultProps = {
  content: '',
};

export default Button;
