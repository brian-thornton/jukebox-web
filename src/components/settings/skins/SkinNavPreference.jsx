import Form from 'react-bootstrap/Form';
import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Skin } from '../../shapes';

const propTypes = {
  skin: Skin.isRequired,
  navButtonType: PropTypes.string.isRequired,
  setNavButtonType: PropTypes.func.isRequired,
};

const SkinNavPreference = ({ skin, navButtonType, setNavButtonType }) => (
  <Form>
    <Form.Group>
      <div key={navButtonType} className="mb-3">
        <Form.Check
          inline
          disabled={!skin.isEditable}
          label={<FormattedMessage id="nav_as_links" />}
          name="group1"
          type="radio"
          id="links"
          value="links"
          checked={navButtonType === 'links'}
          onChange={() => setNavButtonType('links')}
        />
        <Form.Check
          inline
          disabled={!skin.isEditable}
          label={<FormattedMessage id="nav_as_buttons" />}
          name="group1"
          type="radio"
          id="buttons"
          value="buttons"
          checked={navButtonType === 'buttons'}
          onChange={() => setNavButtonType('buttons')}
        />
      </div>
    </Form.Group>
  </Form>
);

SkinNavPreference.propTypes = propTypes;

export default SkinNavPreference;
