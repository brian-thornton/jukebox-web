import Form from 'react-bootstrap/Form';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const SkinButtonShape = ({ buttonShape, setButtonShape, skin }) => {
  return (
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
};

export default SkinButtonShape;
