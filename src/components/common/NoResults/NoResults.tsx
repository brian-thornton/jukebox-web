import { FC } from 'react';

import styles from './NoResults.module.css';

interface INoResults {
  text?: string,
  title?: string,
  controls?: any
}

const NoResults: FC<INoResults> = ({
  text, title, controls
}) => (
  <div className={styles.noResultsContainer}>
    <div className={styles.noResultsRow}>
      <div className={styles.noResultsCard}>
          <h3 className={styles.noResultsTitle}>{title}</h3>
          <div className={styles.noResultsText}>
            {text}
          </div>
          <div className={styles.noResultsText}>
            {controls}
          </div>
      </div>
    </div>
  </div>
);

export default NoResults;
