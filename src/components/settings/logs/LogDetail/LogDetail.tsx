import { FC, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FormattedMessage } from 'react-intl';

import Button from '../../../Button';
import styles from './LogDetail.module.css';
import { SettingsContext } from '../../../layout/SettingsProvider';
import { ILog } from '../../../interface';

interface ILogDetail {
  log: ILog,
  onClose: Function,
}

const LogList: FC<ILogDetail> = ({ log, onClose }) => {
  const settings = useContext(SettingsContext);

  const logDetailStyle = {
    color: settings?.styles?.fontColor,
  };

  return (
    <Container fluid>
      <Row>
        <Button content={<FormattedMessage id="go_back" />} onClick={onClose} />
      </Row>
      <Row>
        <Card className={styles.logCard} style={logDetailStyle}>
          <Card.Body>
            <Card.Text>
              {log.text}
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default LogList;
