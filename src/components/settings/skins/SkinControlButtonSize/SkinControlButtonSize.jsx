import Form from 'react-bootstrap/Form';
import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Skin } from '../../../shapes';

const propTypes = {
  skin: Skin.isRequired,
  controlButtonSize: PropTypes.string.isRequired,
  setControlButtonSize: PropTypes.func.isRequired,
};

const SkinControlButtonSize = ({ skin, controlButtonSize, setControlButtonSize }) => (
  <Form>
    <Form.Group>
      <div key={controlButtonSize} className="mb-3">
        <Form.Check
          inline
          disabled={!skin.isEditable}
          label={<FormattedMessage id="small_control_buttons" />}
          name="group3"
          type="radio"
          id="smallControlButtons"
          value="small"
          checked={controlButtonSize === 'small'}
          onChange={() => setControlButtonSize('small')}
        />
        <Form.Check
          inline
          disabled={!skin.isEditable}
          label={<FormattedMessage id="medium_control_buttons" />}
          name="group3"
          type="radio"
          id="mediumControlButtons"
          value="medium"
          checked={controlButtonSize === 'medium'}
          onChange={() => setControlButtonSize('medium')}
        />
        <Form.Check
          inline
          disabled={!skin.isEditable}
          label={<FormattedMessage id="large_control_buttons" />}
          name="group3"
          type="radio"
          id="largeControlButtons"
          value="large"
          checked={controlButtonSize === 'large'}
          onChange={() => setControlButtonSize('large')}
        />
      </div>
    </Form.Group>
  </Form>
);

SkinControlButtonSize.propTypes = propTypes;

export default SkinControlButtonSize;
