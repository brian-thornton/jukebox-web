import React from 'react';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { PropTypes } from 'prop-types';

import Button from '../Button';
import Item from '../common/Item';

const propTypes = {
  description: PropTypes.string.isRequired,
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSetKey: PropTypes.func.isRequired,
  selectedKey: PropTypes.string.isRequired,
};

const ToggleRow = ({
  description,
  keys,
  onSetKey,
  selectedKey,
}) => (
  <Row>
    <Item
      className="preference-toggle-row"
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

ToggleRow.propTypes = propTypes;

export default ToggleRow;
