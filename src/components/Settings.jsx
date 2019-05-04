import React from 'react';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import LibraryList from './LibraryList';

export class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
}
