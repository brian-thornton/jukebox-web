import { FC, useContext } from 'react';

import { Card, Col, Container, Row } from 'react-bootstrap';
import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './SideBySide.module.css';

interface ISideBySide {
  data: any,
  title?: String,
}

const SideBySide: FC<ISideBySide> = ({ data, title }) => {
  const settings = useContext(SettingsContext);

  const activeStyle = {
    border: `2px solid ${settings?.styles?.fontColor}`,
  }

  return (
    <Container fluid style={{ paddingTop: '80px' }}>
      {title && <div className={styles.sideBySideTitle} style={{ color:  settings.styles?.fontColor }}>{title}</div>}
      {data.map((row: any) => (
        <Row>
          {row.map((item: any) => (
            <Col>
              <Card style={item.style} onClick={() => item.action()}>
                <Card.Body className={styles.sideBySideBody} style={item.active ? activeStyle : undefined}>{item.text}</Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};

export default SideBySide;
