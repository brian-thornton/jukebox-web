import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './ContentWithControls.module.css';

interface IContentWithControls {
  alertText?: string,
  content: any,
  controls: any,
}

const ContentWithControls: FC<IContentWithControls> = ({ controls, content, alertText }) => {
  const settings = useContext(SettingsContext);
  const { screen } = settings;

  if (settings.styles) {
    const { headerColor, controlUseBackground } = settings.styles;
    const controlClass = screen?.isMobile ? styles.centeredRow : '';

    const controlStyle = {
      paddingBottom: '20px',
      background: controlUseBackground ? headerColor : '',
      borderBottomRightRadius: '35px',
    };

    const wrapControls = (controls: any) => {
      const colSize = screen?.isMobile ? 12 : 2;
      return <Col lg={colSize} xl={colSize} style={controlStyle}>{controls}</Col>;
    };

    return (
      <Container fluid className={styles.parentContainer}>
        <Row className={styles.alertRow}>
          <Col lg={12} xl={12}>
            {alertText && <Alert variant="primary">{alertText}</Alert>}
          </Col>
        </Row>
        <Row className={`${controlClass} ${styles.mainRow}`}>
          {wrapControls(controls)}
          <Col lg={10} xl={10} className={styles.content}>
            {content}
          </Col>
        </Row>
      </Container>
    );
  }

  return <></>;
};

export default ContentWithControls;
