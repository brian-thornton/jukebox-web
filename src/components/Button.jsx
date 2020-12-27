import React from 'react';
import { PropTypes } from 'prop-types';
import { Button as ReactButton } from 'react-bootstrap';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  content: PropTypes.string,
};

function Button({ onClick, content, style }) {
  return <ReactButton style={style} className="button" variant="outline-light" onClick={onClick}>{content}</ReactButton>;
}

Button.propTypes = propTypes;

export default Button;
