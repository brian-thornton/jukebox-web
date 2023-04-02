import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import { SettingsContext } from '../layout/SettingsProvider';
import './ContentWithControls.scss';
import { topMargin } from '../../lib/styleHelper';

interface IContentWithControls {
  alertText: string,
  content: any,
  controls: any,
};

const ContentWithControls: FC<IContentWithControls> = ({ controls, content, alertText }) => {
  const settings = useContext(SettingsContext);

  if (settings.styles) {
    const { headerColor, controlUseBackground } = settings.styles;

    const controlStyle = {
      paddingTop: '10px',
      paddingBottom: '20px',
      background: controlUseBackground ? headerColor : '',
      borderBottomRightRadius: '35px',
    };

    return (
      <Container fluid style={{ marginTop: topMargin(settings) }}>
        <Row>
          <Col lg={12} xl={12}>
            {alertText && <Alert variant="primary">{alertText}</Alert>}
          </Col>
        </Row>
        <Row>
          <Col lg={2} xl={2} style={controlStyle}>
            {controls}
          </Col>
          <Col lg={10} xl={10}>
            {content}
          </Col>
        </Row>
      </Container>
    );
  }

  return <></>;
};

export default ContentWithControls;
