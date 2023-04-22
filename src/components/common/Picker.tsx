import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FC, useContext } from 'react';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';

interface IPicker {
  applyPadding: boolean,
  items: Array<{
    title: string,
    description?: string,
    buttonText: string,
    onClick: Function,
  }>,
};

const Picker: FC<IPicker> = ({ items, applyPadding }) => {
  const settings = useContext(SettingsContext);

  const pickerCardStyle = (item: any) => ({
    background: settings?.styles?.trackBackgroundColor,
    marginBottom: '20px',
    height: item.description ? '200px' : '120px',
    color: settings?.styles?.fontColor,
  });

  return (
    <Container fluid style={{ paddingTop: applyPadding ? '80px' : '' }}>
      <Row>
        {items.map(item => (
          <Col lg="3" xl="3" md="3" sm="12">
            <Card style={pickerCardStyle(item)}>
              <Card.Title>{item.title}</Card.Title>
              <Card.Body>
                {item.description && <Card.Text>{item.description}</Card.Text>}
                <Button onClick={item.onClick} content={item.buttonText} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Picker;
