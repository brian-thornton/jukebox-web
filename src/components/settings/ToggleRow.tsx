import { FC } from 'react';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Button from '../Button';
import Item from '../common/Item/Item';

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
  <Row>
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
  </Row>
);

export default ToggleRow;
