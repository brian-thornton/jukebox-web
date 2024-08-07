import Form from 'react-bootstrap/Form';
import { FC, useContext, useState } from 'react';

import styles from './AddNew.module.css';
import { SettingsContext } from '../../layout/SettingsProvider';
import Button from '../Buttons/Button/Button';
import NameInput from '../NameInput/NameInput';

interface IAddNew {
  cancelText: string,
  confirmText: string,
  fields: { name: string },
  onCancel: Function,
  onConfirm: Function,
  title: string,
  dropdowns?: Array<any>,
}

const AddNew: FC<IAddNew> = ({
  cancelText, confirmText, fields, onCancel, onConfirm, title, dropdowns,
}) => {
  const settings = useContext(SettingsContext);
  const [fieldValues, setFieldValues] = useState(fields);
  const [localDropdowns, setLocalDropdowns] = useState(dropdowns);

  const confirmStyle = {
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
    <div className={styles.addNewCard} style={confirmStyle}>
      <div style={{ background: 'transparent' }}>
        <div className={styles.addNewTitle}>{title}</div>
        <div className={styles.addNewText}>
          <div className={styles.contentContainer}>
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
            {localDropdowns?.map(dropdown => (
              <Form.Group>
                <Form.Label className={styles.addNewFormLabel}>{dropdown.name}</Form.Label>
                <Form.Select onChange={e => onDrodownValueSet(dropdown, e.target.value)}>
                  {dropdown.options.map((o: string) => <option>{o}</option>)}
                </Form.Select>
              </Form.Group>
            ))}
          </div>
        </div>
        <div className={styles.addNewText}>
          <Button onClick={onCancel} content={cancelText} />
          <Button onClick={() => {
            onConfirm(fieldValues, localDropdowns);
          }} content={confirmText} />
        </div>
      </div>
    </div>
  );
};

export default AddNew;
