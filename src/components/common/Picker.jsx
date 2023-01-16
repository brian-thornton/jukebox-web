import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React, { useContext } from "react";

import Button from "../Button";
import { SettingsContext } from '../layout/SettingsProvider';

const Picker = ({ items }) => {
  const settings = useContext(SettingsContext);

  return (
    <Container fluid>
      <Row>
        {items.map(item => (
          <Col lg="3" xl="3" md="3" sm="12">
            <Card style={{ background: settings.styles.trackBackgroundColor, marginBottom: "20px", height: "200px", color: settings.styles.fontColor }}>
              <Card.Title>{item.title}</Card.Title>
              <Card.Body>
                <Card.Text>{item.description}</Card.Text>
                 <Button onClick={item.onClick} content={item.buttonText} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container >
  );
};

export default Picker;