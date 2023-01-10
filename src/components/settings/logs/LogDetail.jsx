import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { injectIntl } from 'react-intl';

import Button from '../../Button';
import './LogDetail.scss';
import { SettingsContext } from '../../layout/SettingsProvider';

const LogList = ({ intl, log, onClose }) => {
  const settings = useContext(SettingsContext);

  const logDetailStyle = {
    color: settings.styles.fontColor,
  };

  return (
    <Container fluid>
      <Row>
        <Button content={intl.formatMessage({id: 'go_back'})} onClick={onClose} />
      </Row>
      <Row>
        <Card className="logCard" style={logDetailStyle}>
          <Card.Body>
            <Card.Text>
              {log.text}
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default injectIntl(LogList);
