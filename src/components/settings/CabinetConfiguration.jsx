import Container from 'react-bootstrap/Container';
import React from 'react';
import Row from 'react-bootstrap/Row';
import './CabinetConfiguration.scss';
import { injectIntl } from 'react-intl';

import LightingControllers from './LightingControllers';

const CabinetConfiguration = ({ intl }) => (
  <>
    <Container fluid className="cabinet-container">
      <Row>
        {intl.formatMessage({ id: 'cabinet_configuration' })}
      </Row>
      <Row>
        <LightingControllers />
      </Row>
    </Container>
  </>
);

export default injectIntl(CabinetConfiguration);
