import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { SettingsContext } from '../../layout/SettingsProvider';
import './Loading.scss';

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

export default Loading;
