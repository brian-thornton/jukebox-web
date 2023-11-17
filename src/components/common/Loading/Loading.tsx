import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './Loading.module.css';

interface ILoading {
  text: string,
}

const Loading: FC<ILoading> = ({ text }) => {
  const settings = useContext(SettingsContext);

  const loadingInProgressSkin = {
    color: settings?.styles?.fontColor,
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
            {text}
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default Loading;
