import Form from 'react-bootstrap/Form';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const SkinNavButtonSize = ({ navButtonSize, setNavButtonSize, skin }) => {
  return (
    <Form>
      <Form.Group>
        <div key={navButtonSize} className="mb-3">
          <Form.Check
            inline
            disabled={!skin.isEditable}
            label={<FormattedMessage id="small_nav_buttons" />}
            name="group2"
            type="radio"
            id="smallNavButtons"
            value="small"
            checked={navButtonSize === 'small'}
            onChange={() => setNavButtonSize('small')}
          />
          <Form.Check
            inline
            disabled={!skin.isEditable}
            label={<FormattedMessage id="medium_nav_buttons" />}
            name="group2"
            type="radio"
            id="mediumNavButtons"
            value="medium"
            checked={navButtonSize === 'medium'}
            onChange={() => setNavButtonSize('medium')}
          />
          <Form.Check
            inline
            disabled={!skin.isEditable}
            label={<FormattedMessage id="large_nav_buttons" />}
            name="group2"
            type="radio"
            id="largeNavButtons"
            value="large"
            checked={navButtonSize === 'large'}
            onChange={() => setNavButtonSize('large')}
          />
        </div>
      </Form.Group>
    </Form>
  );
};

export default SkinNavButtonSize;
