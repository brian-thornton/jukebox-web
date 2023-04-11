import { FC } from 'react';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Button from '../Button';
import Item from '../common/Item';

interface IToggleRow {
  description: string,
  keys: [string],
  onSetKey: Function,
  selectedKey: string,
};

const ToggleRow: FC<IToggleRow> = ({
  description,
  keys,
  onSetKey,
  selectedKey,
}) => (
  <Row>
    <Item
      onClick={() => {}}
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
