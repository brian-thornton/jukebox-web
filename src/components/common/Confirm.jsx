import Card from 'react-bootstrap/Card';
import React, { useContext }  from 'react';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import './Confirm.scss';

const Confirm = ({ onConfirm, onCancel, text }) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;

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
          <Button onClick={onCancel} content="No" />
          <Button onClick={onConfirm} content="Yes" />
        </div>
      </Card.Body>
    </Card>
  );
};

export default Confirm;