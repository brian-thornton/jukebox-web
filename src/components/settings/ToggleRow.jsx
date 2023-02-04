import React from 'react';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Button from '../Button';
import Item from '../common/Item';

const ToggleRow = ({ description, selectedKey, onSetKey, keys }) => {
  return (
    <Row>
      <Item
        className="preference-toggle-row"
        buttons={(
          <ButtonGroup>
            {keys.map((key) => (
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
  )
};

export default ToggleRow;
