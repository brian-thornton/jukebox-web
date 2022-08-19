import Card from 'react-bootstrap/Card';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import Button from '../../Button';
import NameInput from '../../common/NameInput';
import { SettingsContext } from '../../layout/SettingsProvider';
import './LibraryAdd.scss';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

const Discover = ({
  handleHide,
  handleSave,
}) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings.styles.fontColor,
  };

  return (
    <Card className="addNewCard" style={confirmStyle}>
      <Card.Title>Discover</Card.Title>
      <Card.Body>
        <NameInput placeholder="Path" />
        <Button content="Cancel" onClick={handleHide} />
        <Button content="Save" onClick={handleSave} />
      </Card.Body>
    </Card>
  );
}

Discover.propTypes = propTypes;

export default Discover;
