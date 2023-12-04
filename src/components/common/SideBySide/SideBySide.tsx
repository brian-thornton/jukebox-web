import { FC, useContext } from 'react';

import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './SideBySide.module.css';

interface ISideBySide {
  data: any,
  title?: String,
}

const SideBySide: FC<ISideBySide> = ({ data, title }) => {
  const settings = useContext(SettingsContext);

  return (
    <div className={styles.sideBySideOuterContainer}>
      <>
        {data.map((row: any) => (
          <div
            className={styles.sideBySideItem}
            style={{
              background: settings?.styles?.buttonBackgroundColor,
              color: settings?.styles?.fontColor,
            }}
            onClick={() => row.action()}
          >
            {row.text}
          </div>
        ))}
      </>
    </div>
  );
};

export default SideBySide;
