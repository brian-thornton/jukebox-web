import { PropTypes } from 'prop-types';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
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
  cancelText, confirmText, fields, onCancel, onConfirm, title, dropdowns,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;
  const [fieldValues, setFieldValues] = useState(fields);
  const [localDropdowns, setLocalDropdowns] = useState(dropdowns);

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings.styles.fontColor,
  };

  const onDrodownValueSet = (dropdown, value) => {
    const cloneDropdowns = [...localDropdowns];
    const updated = cloneDropdowns.find(d => d.name === dropdown.name);
    updated.value = value;
    setLocalDropdowns(cloneDropdowns);
  };

  return (
    <Card className="addNewCard" style={confirmStyle}>
      <Card.Body style={{ background: settings.styles.trackBackgroundColor }}>
        <Card.Title className="addNewTitle">{title}</Card.Title>
        <Card.Text className="addNewText">
          <Container fluid>
            <Row>
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
            </Row>
            <Row>
              <>
                {localDropdowns?.map(dropdown => (
                  <Form.Group>
                    <Form.Label className="addNewFormLabel">{dropdown.name}</Form.Label>
                    <Form.Select onChange={e => onDrodownValueSet(dropdown, e.target.value)}>
                      {dropdown.options.map(o => <option>{o}</option>)}
                    </Form.Select>
                  </Form.Group>
                ))}
              </>
            </Row>
          </Container>
        </Card.Text>
        <div className="addNewText">
          <Button onClick={onCancel} content={cancelText} />
          <Button onClick={() => onConfirm(fieldValues, localDropdowns)} content={confirmText} />
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
