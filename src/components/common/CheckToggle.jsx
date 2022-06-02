import Button from 'react-bootstrap/Button';
import { CheckSquare, Square } from 'react-bootstrap-icons';
import React, { useContext } from 'react';

import { SettingsContext } from '../layout/SettingsProvider';

const CheckToggle = ({ isChecked, onClick }) => {
  const settings = useContext(SettingsContext);

  const buttonStyle = {
    background: settings.styles.buttonBackgroundColor,
    fontWeight: settings.styles.buttonFontWeight,
    color: settings.styles.buttonFontColor,
    fontFamily: settings.styles.buttonFont,
    marginBottom: '10px',
    marginRight: '10px',
  };

  return (
    <>
      <Button style={buttonStyle} onClick={onClick}>
        {isChecked && <CheckSquare />}
        {!isChecked && <Square />}
      </Button>
    </>
  );
};

export default CheckToggle;