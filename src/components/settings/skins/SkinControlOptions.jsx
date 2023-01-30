import Form from 'react-bootstrap/Form';
import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Skin } from '../../shapes';

const propTypes = {
  skin: Skin.isRequired,
  buttonShape: PropTypes.string.isRequired,
  setButtonShape: PropTypes.func.isRequired,
};

const SkinControlUseBackground = ({ controlUseBackground, setControlUseBackground, skin }) => (
  <Form>
    <Form.Group>
      <div key={controlUseBackground} className="mb-3">
        <Form.Check
          inline
          disabled={!skin.isEditable}
          label={<FormattedMessage id="use_background_for_control_panel" />}
          name="useBackgroundGroup"
          type="switch"
          id="true"
          value="true"
          checked={controlUseBackground === true}
          onChange={() => setControlUseBackground(true)}
        />
        <Form.Check
          inline
          disabled={!skin.isEditable}
          label={<FormattedMessage id="no_background_for_control_panel" />}
          name="useBackgroundGroup"
          type="switch"
          id="false"
          value="false"
          checked={controlUseBackground === false}
          onChange={() => setControlUseBackground(false)}
        />
      </div>
    </Form.Group>
  </Form>
);

SkinControlUseBackground.propTypes = propTypes;

export default SkinControlUseBackground;
