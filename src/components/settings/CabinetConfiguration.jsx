import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/'
import React from "react";
import Row from 'react-bootstrap/Row';

import LightingControllers from './LightingControllers';
import NameInput from '../common/NameInput';

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