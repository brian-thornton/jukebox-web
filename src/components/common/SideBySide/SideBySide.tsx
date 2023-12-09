import { FC } from 'react';

import styles from './SideBySide.module.css';

interface ISideBySide {
  data: any,
  title?: String,
}

const SideBySide: FC<ISideBySide> = ({ data, title }) => (
  <div className={styles.sideBySideOuterContainer}>
    <>
      {data.map((row: any) => (
        <div
          className={styles.sideBySideItem}
          onClick={() => row.action()}
        >
          {row.text}
        </div>
      ))}
    </>
  </div>
);

export default SideBySide;
