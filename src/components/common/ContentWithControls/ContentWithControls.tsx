import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './ContentWithControls.module.css';
import { topMargin } from '../../../lib/styleHelper';

interface IContentWithControls {
  alertText?: string,
  content: any,
  controls: any,
};

const ContentWithControls: FC<IContentWithControls> = ({ controls, content, alertText }) => {
  const settings = useContext(SettingsContext);
  const { screen } = settings;

  if (settings.styles) {
    const { headerColor, controlUseBackground } = settings.styles;
    const controlClass = screen?.isMobile ? styles.centeredRow : '';

    const controlStyle = {
      paddingTop: '10px',
      paddingBottom: '20px',
      background: controlUseBackground ? headerColor : '',
      borderBottomRightRadius: '35px',
    };

    const wrapControls = (controls: any) => {
      const colSize = screen?.isMobile ? 12 : 2;
      return <Col lg={colSize} xl={colSize} style={controlStyle}>{controls}</Col>;
    };

    return (
      <Container fluid style={{ marginTop: topMargin(settings), marginRight: '0', marginLeft: '0', paddingLeft: '0', paddingRight: '0' }}>
        <Row style={{ marginRight: '0', marginLeft: '0' }}>
          <Col lg={12} xl={12}>
            {alertText && <Alert variant="primary">{alertText}</Alert>}
          </Col>
        </Row>
        <Row className={controlClass} style={{ marginRight: '0', marginLeft: '0' }}>
          {wrapControls(controls)}
          <Col lg={10} xl={10} style={{ width: '100%', marginRight: '0', marginLeft: '0', paddingLeft: '0', paddingRight: '0' }}>
            {content}
          </Col>
        </Row>
      </Container>
    );
  }

  return <></>;
};

export default ContentWithControls;
