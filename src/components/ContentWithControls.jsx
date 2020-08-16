import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Alert, ListGroup, ListGroupItem, Button, Container, Row, Col,
} from 'react-bootstrap';

function ContentWithControls({ controls, content, alertText }) {
  return (
    <Container>
      <Row>
        <Col lg={12} xl={12}>
          <Alert variant="primary">{alertText}</Alert>
        </Col>
      </Row>
      <Row>
        <Col lg={2} xl={2}>
          {controls}
        </Col>
        <Col lg={10} xl={10}>
          {content}
        </Col>
      </Row>
    </Container>
  );
}

export default ContentWithControls;

