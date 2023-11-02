import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { FC, useContext } from 'react';

import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './FilePicker.module.css';

interface IFilePicker {
  onConfirm: Function,
  onSelectFile: Function,
  onCancel: Function,
  title: string,
  confirmText: string,
  cancelText: string,
}

const FilePicker: FC<IFilePicker> = ({
  onConfirm, onSelectFile, onCancel, title, confirmText, cancelText,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings?.styles?.fontColor,
  };

  return (
    <Card style={confirmStyle} className={styles.addNewCard}>
      <Card.Body>
        <Card.Title className={styles.addNewTitle}>{title}</Card.Title>
        <Card.Text className={styles.addNewText}>
          <Form.Control className={styles.fileControl} type="file" onChange={(e) => onSelectFile()} />
        </Card.Text>
        <div className={styles.addNewText}>
          <Button onClick={onCancel} content={cancelText} />
          <Button onClick={onConfirm} content={confirmText} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default FilePicker;
