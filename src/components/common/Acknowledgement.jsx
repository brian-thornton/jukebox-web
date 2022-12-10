import Card from 'react-bootstrap/Card';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import './Confirm.scss';

const propTypes = {
  onGoToTargetClick: PropTypes.func.isRequired,
  onStayOnPageClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const Acknowledgement = ({ onGoToTargetClick, onStayOnPageClick, text }) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  const { controlButtonSize } = settings.styles;
  const buttonWidth = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 60;

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    background: 'transparent',
    minHeight: '200px',
    height: '100%',
    borderColor: 'black',
    color: settings.styles.fontColor,
  };

  return (
    <Card style={confirmStyle}>
      <Card.Body>
        <Card.Title className="confirmTitle">Are you sure?</Card.Title>
        <Card.Text className="confirmText">
          {text}
        </Card.Text>
        <div className="confirmText">
          <Button height={buttonWidth} width={buttonHeight} onClick={onGoToTargetClick} content="No" />
          <Button height={buttonWidth} width={buttonHeight} onClick={onStayOnPageClick} content="Yes" />
        </div>
      </Card.Body>
    </Card>
  );
};

Acknowledgement.propTypes = propTypes;

export default Acknowledgement;
