import Form from 'react-bootstrap/Form';
import React from 'react';

const SkinNavButtonSize = ({ navButtonSize, setNavButtonSize, skin }) => {
  return (
    <Form>
      <Form.Group>
        <div key={navButtonSize} className="mb-3">
          <Form.Check
            inline
            disabled={!skin.isEditable}
            label="Small Nav Buttons"
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
            label="Medium Nav Buttons"
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
            label="Large Nav Buttons"
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
