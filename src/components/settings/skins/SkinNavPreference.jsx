import Form from 'react-bootstrap/Form';
import React from 'react';

const SkinNavPreference = ({ skin, navButtonType, setNavButtonType }) => {
  return (
    <Form>
      <Form.Group>
        <div key={navButtonType} className="mb-3">
          <Form.Check
            inline
            disabled={!skin.isEditable}
            label="Nav as Links"
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
            label="Nav as Buttons"
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
};

export default SkinNavPreference;
