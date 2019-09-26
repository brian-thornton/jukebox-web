import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import LibraryList from './LibraryList';

function Settings() {
    return (
      <Container>
        <Row>
          <Col lg={12} xl={12}>
            <LibraryList />
          </Col>
        </Row>
      </Container>
    );
}

export default Settings;
