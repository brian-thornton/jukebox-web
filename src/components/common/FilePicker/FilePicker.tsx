import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { FC, useContext } from 'react';

import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import './FilePicker.scss';

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
    <Card style={confirmStyle} className="addNewCard">
      <Card.Body>
        <Card.Title className="addNewTitle">{title}</Card.Title>
        <Card.Text className="addNewText">
          <Form.Control className="fileControl" type="file" onChange={(e) => onSelectFile()} />
        </Card.Text>
        <div className="addNewText">
          <Button onClick={onCancel} content={cancelText} />
          <Button onClick={onConfirm} content={confirmText} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default FilePicker;
