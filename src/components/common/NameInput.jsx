import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { PropTypes } from 'prop-types';
import React from 'react';

const propTypes = {
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
};

const NameInput = ({
  defaultValue,
  onChange,
  placeholder,
  onEnter,
}) => (
  <InputGroup className="mb-3">
    <FormControl
      id="name"
      placeholder={placeholder || "Name"}
      aria-label="Name"
      defaultValue={defaultValue}
      aria-describedby="basic-addon1"
      onChange={onChange}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onEnter();
        }
      }}
    />
  </InputGroup>
);

NameInput.defaultProps = {
  defaultValue: '',
  onChange: null,
  placeholder: null,
};

NameInput.propTypes = propTypes;

export default NameInput;
