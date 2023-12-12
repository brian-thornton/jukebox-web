import Card from 'react-bootstrap/Card';
import { FC } from 'react';

import styles from './NoResults.module.css';

interface INoResults {
  text?: string,
  title?: string,
  controls?: any,
  applyMargin?: boolean,
  onGoBack?: Function,
}

const NoResults: FC<INoResults> = ({
  text, title, controls, applyMargin = true, onGoBack,
}) => (
  <div className={styles.noResultsContainer}>
    <div className={styles.noResultsRow}>
      <Card className={styles.noResultsCard}>
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
    </div>
  </div>
);

export default NoResults;
