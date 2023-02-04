import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FormattedMessage } from 'react-intl';
import { PropTypes } from 'prop-types';

import Button from '../../Button';
import './LogDetail.scss';
import { SettingsContext } from '../../layout/SettingsProvider';
import { Log } from '../../shapes';

const propTypes = {
  log: Log.isRequired,
  onClose: PropTypes.func.isRequired,
};

const LogList = ({ log, onClose }) => {
  const settings = useContext(SettingsContext);

  const logDetailStyle = {
    color: settings.styles.fontColor,
  };

  return (
    <Container fluid>
      <Row>
        <Button content={<FormattedMessage id="go_back" />} onClick={onClose} />
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

LogList.propTypes = propTypes;

export default LogList;
