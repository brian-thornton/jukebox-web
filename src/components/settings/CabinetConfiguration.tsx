import styles from './CabinetConfiguration.module.css';
import { FormattedMessage } from 'react-intl';

import LightingControllers from './LightingControllers';

const CabinetConfiguration = () => (
  <div className={styles.container}>
    <FormattedMessage id="cabinet_configuration" />
    <LightingControllers />
  </div>
);

export default CabinetConfiguration;
