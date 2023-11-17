import Card from 'react-bootstrap/Card';
import { FC, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FormattedMessage } from 'react-intl';

import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './NoResults.module.css';
import Button from '../../Button';

interface INoResults {
  text?: string,
  title?: string,
  controls?: any,
  applyMargin?: boolean,
  onGoBack?: Function,
}

const NoResults: FC<INoResults> = ({
  text, title, controls, applyMargin = true, onGoBack,
}) => {
  const settings = useContext(SettingsContext);

  const noResultsStyle = {
    color: settings?.styles?.fontColor,
    width: '100%',
  };

  return (
    <Container fluid className={styles.noResultsContainer}>
      {onGoBack && (
        <Row>
          <Button onClick={onGoBack} content={<FormattedMessage id="go_back" />} />
        </Row>
      )}
      <Row className={styles.noResultsRow}>
        <Card className={styles.noResultsCard} style={noResultsStyle}>
          <Card.Body>
            <Card.Title className={styles.noResultsTitle}>{title}</Card.Title>
            <Card.Text className={styles.noResultsText}>
              {text}
            </Card.Text>
            <div className={styles.noResultsText}>
              {controls}
            </div>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default NoResults;
