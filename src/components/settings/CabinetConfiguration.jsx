import Container from 'react-bootstrap/Container';
import React from "react";
import Row from 'react-bootstrap/Row';
import './CabinetConfiguration.scss'

import LightingControllers from './LightingControllers';

const CabinetConfiguration = ({ }) => {
  return (
    <>
      <Container fluid className="cabinet-container">
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