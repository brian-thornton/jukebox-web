import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import { updateSettings } from '../../../lib/settings-client';

const propTypes = {
  selectedCategory: PropTypes.string,
  onSelectCategory: PropTypes.func.isRequired,
};

const CategoryPicker = ({
  category,
  onSelectCategory,
}) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const [newCategory, setNewCategory] = useState();
  const [categories, setCategories] = useState(settings.categories);
  const [addMode, setAddMode] = useState(false);

  const onAddCategory = () => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.categories.push({
      category: newCategory,
      enabled: true,
    });
    updateSettings(deepClone).then(() => {
      setCategories(deepClone.categories);
      setNewCategory('');
      setAddMode(false);
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12" lg="12">
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2" style={{ color: settings.styles.fontColor }}>
              <FormattedMessage id="category" />
            </Form.Label>
            <Col sm="10">
              <Form.Control as="select" value={category} onChange={e => onSelectCategory(e.target.value)}>
                {categories.map(category => <option>{category.category}</option>)}
              </Form.Control>
            </Col>
          </Form.Group>
          {!addMode && <Button onClick={() => setAddMode(true)} content={<FormattedMessage id="add_new_category" />} />}
        </Col>
      </Row>
      {addMode && (
        <Row>
          <Col md="12" lg="12">
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="3" style={{ color: settings.styles.fontColor }}>
                <FormattedMessage id="new_category" />
              </Form.Label>
              <Col sm="6">
                <FormControl
                  id="category"
                  placeholder={intl.formatMessage({ id: 'new_category_name' })}
                  aria-label="Name"
                  defaultValue={newCategory}
                  aria-describedby="basic-addon1"
                  onChange={event => setNewCategory(event.target.value)}
                />
              </Col>
              <Col sm="3">
                <Button onClick={onAddCategory} content={<FormattedMessage id="save_new_category" />} />
                <Button onClick={() => setAddMode(false)} content={<FormattedMessage id="cancel" />} />
              </Col>
            </Form.Group>
          </Col>
        </Row>
      )}
    </Container>
  );
};

CategoryPicker.defaultProps = {
  category: '',
};

CategoryPicker.propTypes = propTypes;

export default CategoryPicker;
