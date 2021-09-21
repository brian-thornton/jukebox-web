import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Button as ReactButton } from 'react-bootstrap';
import { SettingsContext } from './layout/Jukebox';

const propTypes = {
  onClick: PropTypes.func.isRequired,
  content: PropTypes.string,
};

function Button({ onClick, content }) {
  const settings = useContext(SettingsContext);

  const buttonStyle = {
    background: settings.styles.buttonBackgroundColor,
    fontWeight: settings.styles.buttonFontWeight,
    color: settings.styles.buttonFontColor,
    fontFamily: settings.styles.buttonFont,
  };

  return <ReactButton style={buttonStyle} className="button" variant="outline-light" onClick={onClick}>{content}</ReactButton>;
}

Button.propTypes = propTypes;

Button.defaultProps = {
  content: '',
};

export default Button;
