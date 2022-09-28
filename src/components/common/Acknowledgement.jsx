import Card from 'react-bootstrap/Card';
import React, { useContext, useEffect }  from 'react';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import './Confirm.scss';

const Acknowledgement = ({ onGoToTargetClick, onStayOnPageClick, text }) => {
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
          <Button onClick={onGoToTargetClick} content="No" />
          <Button onClick={onStayOnPageClick} content="Yes" />
        </div>
      </Card.Body>
    </Card>
  )
};

export default Acknowledgement;