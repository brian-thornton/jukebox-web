import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';

import styles from './ContentWithControls.module.css';

const propTypes = {
  alertText: PropTypes.string,
  content: PropTypes.node.isRequired,
  controls: PropTypes.node.isRequired,
};

const ContentWithControls = ({ controls, content, alertText }) => (
  <Container fluid className={styles.contentContainer}>
    <Row>
      <Col lg={12} xl={12}>
        {alertText && <Alert variant="primary">{alertText}</Alert>}
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

ContentWithControls.defaultProps = {
  alertText: '',
};

ContentWithControls.propTypes = propTypes;

export default ContentWithControls;
