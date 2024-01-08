import { FC } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Button from '../../../common/Button/Button';
import Item from '../../../common/Item/Item';
import styles from './FeatureToggleRow.module.css';

interface IToggleRow {
  description: string,
  keys: Array<string>,
  onSetKey: Function,
  selectedKey: string,
  onClick?: Function,
}

const ToggleRow: FC<IToggleRow> = ({
  description,
  keys,
  onSetKey,
  selectedKey,
  onClick,
}) => (
  <div className={styles.featureToggleRow}
    onClick={() => {
      if (onClick) {
        onClick();
      }
    }}
  >
    {description}
    <ButtonGroup>
      {keys.map(key => (
        <Button
          onClick={() => onSetKey(key)}
          isToggle
          isToggled={selectedKey === key}
          content={key}
        />
      ))}
    </ButtonGroup>
  </div>
);

export default ToggleRow;
