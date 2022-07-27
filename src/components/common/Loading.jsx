import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { SettingsContext } from '../layout/SettingsProvider';
import styles from './Loading.module.css';

const Loading = () => {
  const settings = useContext(SettingsContext);

  const loadingInProgressSkin = {
    color: settings.styles.fontColor,
    width: '100%',
  };

  return (
    <Card className={styles.loadingInProgress} style={loadingInProgressSkin}>
      <Card.Body>
        <Container className={styles.loadingContainer}>
          <Row className={styles.animationRow}>
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="secondary" />
          </Row>
          <Row className={styles.textRow}>
            Loading...
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default Loading;