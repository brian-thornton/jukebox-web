import { FC, useContext } from 'react';
import { useIntl } from 'react-intl';

import { Card, Col, Container, Row } from 'react-bootstrap';
import { SettingsContext } from '../layout/SettingsProvider';

interface ISideBySide {
  data: any,
}

const SideBySide: FC<ISideBySide> = ({ data }) => (
  <Container fluid style={{ paddingTop: '80px' }}>
    {data.map((row: any) => (
      <Row>
        {row.map((item: any) => (
          <Col>
            <Card style={item.style} onClick={() => item.action()}>
              <Card.Body style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{item.text}</Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    ))}
  </Container>
);

export default SideBySide;
