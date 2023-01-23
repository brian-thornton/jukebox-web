import Form from 'react-bootstrap/Form';
import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Skin } from '../../shapes';

const propTypes = {
  skin: Skin.isRequired,
  navButtonSize: PropTypes.string.isRequired,
  setNavButtonSize: PropTypes.func.isRequired,
};

const SkinNavButtonSize = ({ navButtonSize, setNavButtonSize, skin }) => (
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

SkinNavButtonSize.propTypes = propTypes;

export default SkinNavButtonSize;
