import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import { SettingsContext } from '../../layout/SettingsProvider';
import Button from '../../common/Button/Button';
import styles from './StartsWithFilter.module.css';

interface IStartsWithFilter {
  startsWithFilter?: string,
  setStartsWithFilter?: Function,
}

const StartsWithFilter: FC<IStartsWithFilter> = ({ startsWithFilter, setStartsWithFilter }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;
  const availableHeight = window.innerHeight;
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const buttonStyle = {
    marginTop: availableHeight < 700 ? '0px' : '5px',
    marginBottom: availableHeight < 700 ? '0px' : '5px',
    marginLeft: '0',
    marginRight: '5px',
  };

  const filterStyle = {
    paddingRight: settings?.preferences?.startsWithLocation === 'left' ? '0px' : '0px',
    marginRight: settings?.preferences?.startsWithLocation === 'left' ? '0px' : '0px',
  };

  return (
    <div className={styles.startsWithFilterContainer} style={filterStyle}>
        {alphabet.map(letter => (
          <Button
            disabled={features?.isLocked}
            onClick={() => {
              if (setStartsWithFilter) {
                setStartsWithFilter(letter);
              }
            }}
            isSelected={letter === startsWithFilter}
            width="40%"
            height="30"
            style={buttonStyle}
            content={letter}
          />
        ))}
        <Button
          disabled={features?.isLocked}
          onClick={() => {
            if (setStartsWithFilter) {
              setStartsWithFilter(null);
            }
          }}
          width="86%"
          height="45"
          style={{marginLeft: '0'}}
          content={<FormattedMessage id="all" />}
        />
    </div>
  );
};

export default StartsWithFilter;
