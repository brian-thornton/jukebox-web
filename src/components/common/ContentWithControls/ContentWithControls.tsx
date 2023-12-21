import Alert from 'react-bootstrap/Alert';
import { FC, useContext } from 'react';

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
      background: controlUseBackground ? headerColor : '',
    };

    return (
      <div className={styles.parentContainer}>
        <div className={styles.alertRow}>
          {alertText && <Alert variant="primary">{alertText}</Alert>}
        </div>
        <div className={`${controlClass} ${styles.mainRow}`}>
          <div className={styles.controls} style={controlStyle}>{controls}</div>
          {content}
        </div>
      </div>
    );
  }

  return <></>;
};

export default ContentWithControls;
