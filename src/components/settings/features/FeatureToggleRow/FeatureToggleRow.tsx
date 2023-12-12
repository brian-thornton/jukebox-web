import { FC } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Button from '../../../Button';
import Item from '../../../common/Item/Item';

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
  <Item
    onClick={() => {
      if (onClick) {
        onClick();
      }
    }}
    buttons={(
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
    )}
    text={description}
  />
);

export default ToggleRow;
