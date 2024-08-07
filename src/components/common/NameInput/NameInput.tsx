import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { FC } from 'react';
import { useIntl } from 'react-intl';

interface INameInput {
  onChange?: Function,
  defaultValue?: string,
  placeholder?: string,
  onEnter?: Function,
  disabled?: boolean,
  name?: string,
}

const NameInput: FC<INameInput> = ({
  defaultValue, onChange, placeholder, onEnter, disabled, name,
}) => {
  const intl = useIntl();

  return (
    <InputGroup className="mb-3">
      {name && <InputGroup.Text id="basic-addon1">{name}</InputGroup.Text>}
      <FormControl
        id="name"
        placeholder={placeholder ? intl.formatMessage({ id: "name" }) : undefined }
        aria-label="Name"
        defaultValue={defaultValue}
        aria-describedby="basic-addon1"
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
        disabled={disabled}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            if (onEnter) {
              onEnter(event);
            }
          }
        }}
      />
    </InputGroup>
  )
};

export default NameInput;
