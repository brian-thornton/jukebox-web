import Button from '../Button';
import {
  ChevronDoubleRight,
  ChevronDoubleLeft,
  ChevronRight,
  ChevronLeft,
} from 'react-bootstrap-icons';
import React, { useContext } from 'react';

import { SettingsContext } from '../layout/SettingsProvider';
import styles from './Paginator.module.css';

const Paginator = ({ onPageChange, selectedPage, totalItems, pageSize, disableRandom }) => {
  const settings = useContext(SettingsContext);
  let pages = Math.floor(totalItems / pageSize);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Button disabled={selectedPage === 1 || settings.features.isLocked} onClick={() => onPageChange(1)} content={<ChevronDoubleLeft />} />
      <Button disabled={selectedPage === 1 || settings.features.isLocked} className={styles.paginatorButton} onClick={() => onPageChange(selectedPage - 1)} content={<ChevronLeft />} />
      {!disableRandom && (<Button hideOnSmall disabled={settings.features.isLocked} className={styles.paginatorButton} onClick={() => onPageChange(Math.floor(Math.random() * pages))} content={`Page ${selectedPage} of ${pages}`} />)}
      <Button disabled={selectedPage === pages + 1 || settings.features.isLocked} className={styles.paginatorButton} onClick={() => onPageChange(selectedPage + 1)} content={<ChevronRight />} />
      <Button disabled={selectedPage === pages + 1 || settings.features.isLocked} className={styles.paginatorButton} onClick={() => onPageChange(pages + 1)} content={<ChevronDoubleRight />} />
    </div>
  );
}

export default Paginator;
