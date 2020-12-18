import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Button as ReactButton } from 'react-bootstrap';

function Button({ onClick, content, style}) {
  return <ReactButton style={style} className="button" variant="outline-light" onClick={onClick}>{content}</ReactButton>
}

export default Button;