import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import {
  ListGroupItem
} from 'react-bootstrap';

import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  alertText: PropTypes.string,
  content: PropTypes.node.isRequired,
  controls: PropTypes.node.isRequired,
};

function Item({ buttons, onClick, text }) {
  const settings = useContext(SettingsContext);

  const itemStyle = {
    width: '90%',
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
    borderColor: '#708090',
    fontFamily: settings.styles.listFont,
  };

  return (
    <ListGroupItem
      onClick={onClick}
      style={itemStyle}
    >
      {text}
      {buttons}
    </ListGroupItem>
  );
}


Item.propTypes = propTypes;

export default Item;
