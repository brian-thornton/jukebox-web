import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './CabinetConfiguration.scss';
import { FormattedMessage } from 'react-intl';

import LightingControllers from './LightingControllers';

const CabinetConfiguration = () => (
  <>
    <Container fluid className="cabinet-container">
      <Row>
        <FormattedMessage id="cabinet_configuration" />
      </Row>
      <Row>
        <LightingControllers />
      </Row>
    </Container>
  </>
);

export default CabinetConfiguration;
