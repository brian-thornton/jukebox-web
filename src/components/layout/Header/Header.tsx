import { FC, useContext, useState } from 'react';
import { List } from 'react-bootstrap-icons';

import styles from './Header.module.css';
import { SettingsContext } from '../SettingsProvider';

interface IHeader {
  brand?: string,
  leftContent: any,
  rightContent: any,
  mobileContent?: any,
}

const Header: FC<IHeader> = ({ brand, leftContent, rightContent, mobileContent }) => {
  const [isHamburgerClicked, setIsHamburgerClicked] = useState(false);
  const settings = useContext(SettingsContext);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerLeft}>
        <div className={styles.leftWrapper} style={
          {
            color: settings?.styles?.fontColor,
            fontFamily: settings?.styles?.headerFont,
          }}>
          <div className={styles.brand}>
            {brand}
          </div>
          {leftContent}
        </div>
      </div>
      <div className={styles.hamburger}>
        <List size={40} onClick={() => setIsHamburgerClicked(!isHamburgerClicked)} />
      </div>
      {isHamburgerClicked && (
        <div className={styles.collapseMenu}>
          {mobileContent}
        </div>
      )}
      <div className={styles.headerRight}>
        {rightContent}
      </div>
    </div>
  );
};

export default Header;
