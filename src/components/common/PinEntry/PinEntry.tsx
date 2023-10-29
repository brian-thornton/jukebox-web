import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { FormattedMessage } from 'react-intl';

import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './PinEntry.module.css';

interface IPinEntry {
  onAuthorize: Function,
  onCancel: Function,
  title?: string,
}

const PinEntry: FC<IPinEntry> = ({ onAuthorize, onCancel, title }) => {
  const settings = useContext(SettingsContext);
  const [pin, setPin] = useState('');
  const { isScreenSmall } = settings;

  useEffect(() => {
    if (pin === settings?.preferences?.pin) {
      onAuthorize();
    }
  }, [pin]);

  const numberButton = (number: any) => (
    <Col lg="1" md="1" sm="3" xs="3">
      <Button onClick={() => setPin(`${pin}${number}`)} content={number} height="75" width="75" />
    </Col>
  );

  const row = (content: any) => content.map((number: any) => numberButton(number));

  const pinStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings?.styles?.fontColor,
  };

  return (
    <>
      {settings && (
        <Card className={styles.pinCard} style={pinStyle}>
          <Card.Body>
            <Card.Title className={styles.pinTitle}>{title}</Card.Title>
            <Container fluid>
              <Row className={styles.pinText}>{row([1, 2, 3])}</Row>
              <Row className={styles.pinText}>{row([4, 5, 6])}</Row>
              <Row className={styles.pinText}>{row([7, 8, 9])}</Row>
              <Row className={styles.pinText}>
                {numberButton('0')}
                <Col lg="1" md="1" sm="3" xs="3">
                  <Button height="75" width="75" onClick={() => setPin('')} content={<FormattedMessage id="clear" />} />
                </Col>
                <Col lg="1" md="1" sm="3" xs="3">
                  <Button height="75" width="75" onClick={onCancel} content={<FormattedMessage id="cancel" />} />
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default PinEntry;
