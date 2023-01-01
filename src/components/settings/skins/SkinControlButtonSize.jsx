import Form from 'react-bootstrap/Form';
import React from 'react';

const SkinControlButtonSize = ({ skin, controlButtonSize, setControlButtonSize }) => {
  return (
    <Form>
      <Form.Group>
        <div key={controlButtonSize} className="mb-3">
          <Form.Check
            inline
            disabled={!skin.isEditable}
            label="Small Control Buttons"
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
            label="Medium Control Buttons"
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
            label="Large Control Buttons"
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

export default SkinControlButtonSize;
