import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React, { useContext, useEffect, useState } from "react";
import Row from 'react-bootstrap/Row';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from './PinEntry.module.css';

const PinEntry = ({ onAuthorize, onCancel, title = 'Enter Pin' }) => {
  const settings = useContext(SettingsContext);
  const [pin, setPin] = useState('');
  const isScreenSmall = window.innerWidth < 700;

  useEffect(() => {
    if (pin === settings.preferences.pin) {
      onAuthorize();
    }
  }, [pin]);

  const numberButton = number => (
    <Col lg="1" md="1" sm="3" xs="3">
      <Button onClick={() => setPin(`${pin}${number}`)} content={number} height="75" width="75" />
    </Col>
  );

  const row = content => content.map(number => numberButton(number));

  const pinStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings.styles.fontColor,
  };

  return (
    <>
      {settings && (
        <Card className={styles.pinCard} style={pinStyle}>
          <Card.Body>
            <Card.Title className={styles.pinTitle}>{title}</Card.Title>
            <Card.Text className={styles.pinText}>{pin.split('').map((p) => '*')}</Card.Text>
            <Container fluid>
              <Row className={styles.pinText}>{row([1, 2, 3])}</Row>
              <Row className={styles.pinText}>{row([4, 5, 6])}</Row>
              <Row className={styles.pinText}>{row([7, 8, 9])}</Row>
              <Row className={styles.pinText}>
                {numberButton("0")}
                <Col lg="1" md="1" sm="3" xs="3">
                  <Button height="75" width="75" onClick={() => setPin('')} content="Clear" />
                </Col>
                <Col lg="1" md="1" sm="3" xs="3">
                  <Button height="75" width="75" onClick={onCancel} content="Cancel" />
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