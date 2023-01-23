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

const SkinButtonShape = ({ buttonShape, setButtonShape, skin }) => (
  <Form>
    <Form.Group>
      <div key={buttonShape} className="mb-3">
        <Form.Check
          inline
          disabled={!skin.isEditable}
          label={<FormattedMessage id="rectangle" />}
          name="buttonShapeGroup"
          type="radio"
          id="rectangle"
          value="rectangle"
          checked={buttonShape === 'rectangle'}
          onChange={() => setButtonShape('rectangle')}
        />
        <Form.Check
          inline
          disabled={!skin.isEditable}
          label={<FormattedMessage id="round" />}
          name="buttonShapeGroup"
          type="radio"
          id="round"
          value="round"
          checked={buttonShape === 'round'}
          onChange={() => setButtonShape('round')}
        />
      </div>
    </Form.Group>
  </Form>
);

SkinButtonShape.propTypes = propTypes;

export default SkinButtonShape;
