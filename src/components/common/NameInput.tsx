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
}

const NameInput: FC<INameInput> = ({
  defaultValue, onChange, placeholder, onEnter, disabled,
}) => {
  const intl = useIntl();

  return (
    <InputGroup className="mb-3">
      <FormControl
        id="name"
        placeholder={placeholder || intl.formatMessage({ id: "name" })}
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
