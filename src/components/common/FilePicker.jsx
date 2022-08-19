import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import React, { useContext } from 'react';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from './FilePicker.scss';

const FilePicker = ({ onConfirm, defaultValue, onSelectFile, onCancel, title = 'Add', confirmText = 'Save', cancelText = 'Cancel' }) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    background: 'transparent',
    minHeight: '200px',
    height: '100%',
    borderColor: 'black',
    color: settings.styles.fontColor,
    swidth: '18rem',
  };

  return (
    <Card style={confirmStyle}>
      <Card.Body>
        <Card.Title className="addNewTitle">{title}</Card.Title>
        <Card.Text className="addNewText">
          <Form.Control style={{ marginBottom: '0px' }} type="file" onChange={onSelectFile} />
        </Card.Text>
        <div className="addNewText">
          <Button onClick={onCancel} content={cancelText} />
          <Button onClick={onConfirm} content={confirmText} />
        </div>
      </Card.Body>
    </Card>
  )
};

export default FilePicker;