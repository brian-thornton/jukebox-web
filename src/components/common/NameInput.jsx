import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { PropTypes } from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

const propTypes = {
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  onEnter: PropTypes.func,
  disabled: PropTypes.bool,
};

const NameInput = ({
  intl, defaultValue, onChange, placeholder, onEnter, disabled,
}) => (
  <InputGroup className="mb-3">
    <FormControl
      id="name"
      placeholder={placeholder || intl.formatMessage({ id: 'name' })}
      aria-label="Name"
      defaultValue={defaultValue}
      aria-describedby="basic-addon1"
      onChange={onChange}
      disabled={disabled}
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
  onEnter: null,
  disabled: false,
};

NameInput.propTypes = propTypes;

export default injectIntl(NameInput);
