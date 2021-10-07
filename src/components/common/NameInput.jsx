import React from 'react';
import {
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';

const propTypes = {
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
};

const NameInput = ({
  defaultValue,
  onChange,
}) => (
  <InputGroup className="mb-3">
    <FormControl
      id="name"
      placeholder="Name"
      aria-label="Name"
      defaultValue={defaultValue}
      aria-describedby="basic-addon1"
      onChange={onChange}
    />
  </InputGroup>
);

NameInput.defaultProps = {
  defaultValue: '',
  onChange: null,
};

NameInput.propTypes = propTypes;

export default NameInput;
