import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  applyPadding: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    buttonText: PropTypes.string,
    onClick: PropTypes.func,
  })),
};

const Picker = ({ items, applyPadding }) => {
  const settings = useContext(SettingsContext);

  const pickerCardStyle = item => ({
    background: settings.styles.trackBackgroundColor,
    marginBottom: '20px',
    height: item.description ? '200px' : '120px',
    color: settings.styles.fontColor,
  });

  return (
    <Container fluid style={{ paddingTop: applyPadding ? '80px' : '' }}>
      <Row>
        {items.map(item => (
          <Col lg="3" xl="3" md="3" sm="12">
            <Card style={pickerCardStyle(item)}>
              <Card.Title>{item.title}</Card.Title>
              <Card.Body>
                {item.description && <Card.Text>{item.description}</Card.Text>}
                <Button onClick={item.onClick} content={item.buttonText} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

Picker.propTypes = propTypes;

Picker.defaultProps = {
  applyPadding: false,
  items: [],
};

export default Picker;