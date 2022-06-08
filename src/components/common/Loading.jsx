import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { SettingsContext } from '../layout/SettingsProvider';

const Loading = () => {
  const settings = useContext(SettingsContext);

  const searchInProgressStyle = {
    background: 'transparent',
    minHeight: '200px',
    height: '100%',
    borderColor: 'black',
    color: settings.styles.fontColor,
    swidth: '18rem',
  };


  return (
    <Card style={searchInProgressStyle}>
      <Card.Body>
        <Container style={{minHeight: '100%', height: '100%'}}>
          <Row style={{ marginTop: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="secondary" />
          </Row>
          <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading...
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default Loading;