import { PropTypes } from 'prop-types';
import Card from 'react-bootstrap/Card';
import React, { useContext, useState } from 'react';

import './AddNew.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import Button from '../Button';
import NameInput from './NameInput';

const propTypes = {
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  fields: PropTypes.shape({ name: PropTypes.string }),
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
};

const AddNew = ({
  cancelText,
  confirmText,
  fields,
  onCancel,
  onConfirm,
  title,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;
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
          {Object.keys(fieldValues).map(f => (
            <NameInput
              onChange={(event) => {
                setFieldValues({
                  ...fieldValues,
                  [f]: event.target.value,
                });
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
  );
};

AddNew.defaultProps = {
  cancelText: 'Cancel',
  confirmText: 'Save',
  fields: { name: 'Name' },
  title: 'Add',
};

AddNew.propTypes = propTypes;

export default AddNew;
