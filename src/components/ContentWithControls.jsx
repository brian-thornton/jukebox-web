import React from 'react';
import { PropTypes } from 'prop-types';
import {
  Alert, Container, Row, Col,
} from 'react-bootstrap';

const propTypes = {
  alertText: PropTypes.string,
  content: PropTypes.node.isRequired,
  controls: PropTypes.node.isRequired,
};

function ContentWithControls({ controls, content, alertText }) {
  return (
    <Container fluid>
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

ContentWithControls.defaultProps = {
  alertText: '',
};

ContentWithControls.propTypes = propTypes;

export default ContentWithControls;
