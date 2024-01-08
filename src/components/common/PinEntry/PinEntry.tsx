import { FC, useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../Button/Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './PinEntry.module.css';

interface IPinEntry {
  onAuthorize: Function,
  onCancel: Function,
  title?: string,
}

const PinEntry: FC<IPinEntry> = ({ onAuthorize, onCancel, title }) => {
  const settings = useContext(SettingsContext);
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (pin === settings?.preferences?.pin) {
      onAuthorize();
    }
  }, [pin]);

  const numberButton = (number: any) => (
    <Button onClick={() => setPin(`${pin}${number}`)} content={number} height="75" width="75" />
  );

  const row = (content: any) => content.map((number: any) => numberButton(number));

  return (
    <div className={styles.pinContainer}>
      <div className={styles.pinRow}>{row([1, 2, 3])}</div>
      <div className={styles.pinRow}>{row([4, 5, 6])}</div>
      <div className={styles.pinRow}>{row([7, 8, 9])}</div>
      <div className={styles.pinRow}>
        <Button height="75" width="75" onClick={() => setPin('')} content={<FormattedMessage id="clear" />} />
        <Button height="75" width="75" onClick={onCancel} content={<FormattedMessage id="cancel" />} />
      </div>
    </div>
  )
};

export default PinEntry;
