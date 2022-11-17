import Card from 'react-bootstrap/Card';
import React, { useContext }  from 'react';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import './Confirm.scss';

const Confirm = ({ onConfirm, onCancel, text }) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  const { controlButtonSize } = settings.styles;
  const buttonWidth = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '60';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '20px';

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings.styles.fontColor,
  };

  return (
    <Card className="confirmCard" style={confirmStyle}>
      <Card.Body>
        <Card.Title className="confirmTitle">Are you sure?</Card.Title>
        <Card.Text className="confirmText">
          {text}
        </Card.Text>
        <div className="confirmText">
          <Button height={buttonWidth} width={buttonHeight} style={{ fontSize }} onClick={onCancel} content="No" />
          <Button height={buttonWidth} width={buttonHeight} style={{ fontSize }} onClick={onConfirm} content="Yes" />
        </div>
      </Card.Body>
    </Card>
  );
};

export default Confirm;