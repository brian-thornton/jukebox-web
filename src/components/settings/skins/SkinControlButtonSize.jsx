import Form from 'react-bootstrap/Form';
import React from 'react';
import { injectIntl } from 'react-intl';

const SkinControlButtonSize = ({ intl, skin, controlButtonSize, setControlButtonSize }) => {
  return (
    <Form>
      <Form.Group>
        <div key={controlButtonSize} className="mb-3">
          <Form.Check
            inline
            disabled={!skin.isEditable}
            label={intl.formatMessage({ id: 'small_control_buttons' })}
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
            label={intl.formatMessage({ id: 'medium_control_buttons' })}
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
            label={intl.formatMessage({ id: 'large_control_buttons' })}
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
};

export default injectIntl(SkinControlButtonSize);
