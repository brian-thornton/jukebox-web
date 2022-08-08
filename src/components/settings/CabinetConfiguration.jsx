import Container from 'react-bootstrap/Container';
import React from "react";
import Row from 'react-bootstrap/Row';

import LightingControllers from './LightingControllers';

const CabinetConfiguration = ({ }) => {
  return (
    <>
      <Container fluid style={{width: '100%'}}>
        <Row>
          Cabinet Configuration
        </Row>
        <Row>
          <LightingControllers />
        </Row>
      </Container>
    </>
  )
};

export default CabinetConfiguration;