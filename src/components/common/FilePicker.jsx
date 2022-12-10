import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import './FilePicker.scss';

const propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onSelectFile: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

const FilePicker = ({
  onConfirm,
  onSelectFile,
  onCancel,
  title,
  confirmText,
  cancelText,
}) => {
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
  );
};

FilePicker.defaultProps = {
  title: '',
  confirmText: '',
  cancelText: '',
};

FilePicker.propTypes = propTypes;

export default FilePicker;
