import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FC, useContext, useState } from 'react';

import './AddNew.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import Button from '../Button';
import NameInput from './NameInput';

interface IAddNew {
  cancelText: string,
  confirmText: string,
  fields: { name: string },
  onCancel: Function,
  onConfirm: Function,
  title: string,
  dropdowns?: Array<any>,
};

const AddNew: FC<IAddNew> = ({
  cancelText, confirmText, fields, onCancel, onConfirm, title, dropdowns,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;
  const [fieldValues, setFieldValues] = useState(fields);
  const [localDropdowns, setLocalDropdowns] = useState(dropdowns);

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings?.styles?.fontColor,
  };

  const onDrodownValueSet = (dropdown: any, value: any) => {
    // @ts-ignore
    const cloneDropdowns = [...localDropdowns];
    const updated = cloneDropdowns.find(d => d.name === dropdown.name);
    updated.value = value;
    setLocalDropdowns(cloneDropdowns);
  };

  return (
    <Card className="addNewCard" style={confirmStyle}>
      <Card.Body style={{ background: settings?.styles?.trackBackgroundColor }}>
        <Card.Title className="addNewTitle">{title}</Card.Title>
        <Card.Text className="addNewText">
          <Container fluid>
            <Row>
              {Object.keys(fieldValues).map(f => (
                <NameInput
                  onChange={(event: any) => {
                    console.log(event)
                    setFieldValues({
                      ...fieldValues,
                      [f]: event.target.value,
                    });
                  }}
                  // @ts-ignore
                  placeholder={fieldValues[f]}
                  //@ts-ignore
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
                      {dropdown.options.map((o: string) => <option>{o}</option>)}
                    </Form.Select>
                  </Form.Group>
                ))}
              </>
            </Row>
          </Container>
        </Card.Text>
        <div className="addNewText">
          <Button onClick={onCancel} content={cancelText} />
          <Button onClick={() => {
            onConfirm(fieldValues, localDropdowns);
          }} content={confirmText} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default AddNew;
