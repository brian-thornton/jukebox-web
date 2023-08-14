import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FC, useContext } from 'react';

import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';

interface IPicker {
  applyPadding: boolean,
  itemHeight?: string,
  items: Array<{
    title?: string,
    description?: string,
    buttonText: string,
    buttonWidth?: string,
    onClick: Function,
  }>,
};

const Picker: FC<IPicker> = ({ items, applyPadding, itemHeight }) => {
  const settings = useContext(SettingsContext);

  const pickerCardStyle = (item: any) => {
    const style = {
      background: settings?.styles?.trackBackgroundColor,
      marginBottom: '20px',
      height: item.description ? '200px' : '120px',
      color: settings?.styles?.fontColor,
    }

    if (!item.title) {
      style.height = '110px';
    }

    if (itemHeight) {
      style.height = itemHeight;
    }

    return style;
  };

  return (
    <Container fluid style={{ paddingTop: applyPadding ? '80px' : '' }}>
      <Row>
        {items.map(item => (
          <Col lg="3" xl="3" md="3" sm="12">
            <Card style={pickerCardStyle(item)}>
              {item.title && <Card.Title>{item.title}</Card.Title>}
              <Card.Body style={{paddingTop: '5px'}}>
                {item.description && <Card.Text>{item.description}</Card.Text>}
                <Button width={item.buttonWidth} onClick={item.onClick} content={item.buttonText} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Picker;
