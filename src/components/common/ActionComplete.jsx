import React from 'react';
import Card from 'react-bootstrap/Card';

import './ActionComplete.scss';

const ActionComplete = ({ text, title }) => {
  <Card className="addNewCard" style={confirmStyle}>
    <Card.Body>
      <Card.Title className="addNewTitle">{title}</Card.Title>
      <Card.Text className="addNewText">
        {text}
      </Card.Text>
      <div className="addNewText">
        <Button onClick={onCancel} content={cancelText} />
        <Button onClick={() => onConfirm(fieldValues, localDropdowns)} content={confirmText} />
      </div>
    </Card.Body>
  </Card>
};

export default ActionComplete;
