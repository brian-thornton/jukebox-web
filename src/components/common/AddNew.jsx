import Card from 'react-bootstrap/Card';
import React, { useContext, useState } from 'react';

import Button from '../Button';
import NameInput from './NameInput';
import { SettingsContext } from '../layout/SettingsProvider';
import './AddNew.scss';

const AddNew = ({ onConfirm, onCancel, title = 'Add', confirmText = 'Save', cancelText = 'Cancel', fields = { name: 'Name' } }) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
  const [fieldValues, setFieldValues] = useState(fields);

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings.styles.fontColor,
  };

  return (
    <Card className="addNewCard" style={confirmStyle}>
      <Card.Body>
        <Card.Title className="addNewTitle">{title}</Card.Title>
        <Card.Text className="addNewText">
          {Object.keys(fieldValues).map((f) => (
            <NameInput
              onChange={(event) => {
                setFieldValues({
                  ...fieldValues,
                  [f]: event.target.value,
                })
              }}
              placeholder={fieldValues[f]}
              defaultValue={fieldValues[f]}
            />
          ))}
        </Card.Text>
        <div className="addNewText">
          <Button onClick={onCancel} content={cancelText} />
          <Button onClick={() => onConfirm(fieldValues)} content={confirmText} />
        </div>
      </Card.Body>
    </Card>
  )
};

export default AddNew;