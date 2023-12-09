import { FC, useState } from 'react';
import { List } from 'react-bootstrap-icons';

import styles from './Header.module.css';

interface IHeader {
  brand?: string,
  leftContent: any,
  rightContent: any,
  mobileContent?: any,
}

const Header: FC<IHeader> = ({ brand, leftContent, rightContent, mobileContent }) => {
  const [isHamburgerClicked, setIsHamburgerClicked] = useState(false);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerLeft}>
        <div className={styles.leftWrapper}>
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
