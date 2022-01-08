import { Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import React, { useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';

import Button from '../Button';
import Modal from '../common/Modal';
import NameInput from '../common/NameInput';
import { SettingsContext } from '../layout/SettingsProvider';
import { updateSettings } from '../../lib/settings-client';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

function LibraryAddModal({
  isOpen,
  handleHide,
  handleSave,
}) {
  const settings = useContext(SettingsContext);
  const [isTopLevelCategory, setTopLevelCategory] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [categories, setCategories] = useState(settings.categories);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState();

  const onAddCategory = () => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.categories.push(newCategory);
    updateSettings(deepClone).then(() => {
      setCategories(deepClone.categories);
      setNewCategory('');
      setAddMode(false);
    });
  };

  useEffect(() => setSelectedCategory(newCategory), [categories]);

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onCancel={handleHide}
      onConfirm={() => handleSave(selectedCategory)}
      title="Add Library"
      body={(
        <>
          <NameInput placeholder="Path" />
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2" style={{ color: settings.styles.fontColor }}>
              Category:
            </Form.Label>
            <Col sm="10">
              <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((category) => <option>{category}</option>)}
              </Form.Control>
            </Col>
          </Form.Group>
          {!addMode && <Button onClick={() => setAddMode(true)} content="Add New Category" />}
          {addMode && (
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="3" style={{ color: settings.styles.fontColor }}>
                New Category:
              </Form.Label>
              <Col sm="6">
                <FormControl
                  id="category"
                  placeholder="New Category Name"
                  aria-label="Name"
                  defaultValue={newCategory}
                  aria-describedby="basic-addon1"
                  onChange={(event) => setNewCategory(event.target.value)}
                />
              </Col>
              <Col sm="3">
                <Button onClick={onAddCategory} content="Save" />
                <Button onClick={() => setAddMode(false)} content="Cancel" />
              </Col>
            </Form.Group>
          )}
        </>
      )}
    />
  );

}

LibraryAddModal.propTypes = propTypes;

export default LibraryAddModal;
