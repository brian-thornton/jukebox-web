import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { PropTypes } from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';

import Button from '../../Button';
import NameInput from '../../common/NameInput';
import { SettingsContext } from '../../layout/SettingsProvider';
import { updateSettings } from '../../../lib/settings-client';
import './LibraryAdd.scss';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

const LibraryAdd = ({
  setShow,
  handleSave,
}) => {
  const settings = useContext(SettingsContext);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [categories, setCategories] = useState(settings.categories);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState();
  const isScreenSmall = window.innerWidth < 700;

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

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings.styles.fontColor,
  };

  return (
    <Card className="addNewCard" style={confirmStyle}>
      <Card.Title>Add Library</Card.Title>
      <Card.Body>
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
        <Button content="Cancel" onClick={() => setShow(false)} />
        <Button content="Save" onClick={() => handleSave(selectedCategory)} />
      </Card.Body>
    </Card>
  );
}

LibraryAdd.propTypes = propTypes;

export default LibraryAdd;
