import Card from 'react-bootstrap/Card';
import React, { useContext } from 'react';

import Button from '../Button';
import NameInput from './NameInput';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from './AddNew.module.css';

const AddNew = ({ onConfirm, onCancel, confirmText = 'Save', cancelText = 'Cancel' }) => {
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
        <Card.Title className={styles.addNewTitle}>Add</Card.Title>
        <Card.Text className={styles.addNewText}>
          <NameInput onEnter={onConfirm} />
        </Card.Text>
        <div className={styles.addNewText}>
          <Button onClick={onCancel} content={cancelText} />
          <Button onClick={onConfirm} content={confirmText} />
        </div>
      </Card.Body>
    </Card>
  )
};

export default AddNew;