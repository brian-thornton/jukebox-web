import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';

import { SettingsContext } from '../layout/SettingsProvider';
import './Loading.scss';

const propTypes = {
  text: PropTypes.string,
};

const Loading = ({ text }) => {
  const settings = useContext(SettingsContext);

  const loadingInProgressSkin = {
    color: settings.styles.fontColor,
    width: '100%',
  };

  return (
    <Card className="loadingInProgress" style={loadingInProgressSkin}>
      <Card.Body>
        <Container className="loadingContainer">
          <Row className="animationRow">
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="secondary" />
          </Row>
          <Row className="textRow">
            {text}
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

Loading.defaultProps = {
  text: 'Loading...',
};

Loading.propTypes = propTypes;

export default Loading;
