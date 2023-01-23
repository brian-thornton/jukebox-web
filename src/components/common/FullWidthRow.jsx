import Col from 'react-bootstrap/Col';
import React from 'react';
import Row from 'react-bootstrap/Row';

import './FullWidthRow.scss';

const FullWidthRow = ({ children }) => (
  <Row className="fullWidthRow">
    <Col lg="12" xl="12" md="12" sm="12">
      {children}
    </Col>
  </Row>
);

export default FullWidthRow;
