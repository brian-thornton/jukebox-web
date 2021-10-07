import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { ListGroupItem } from 'react-bootstrap';

import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  buttons: PropTypes.node,
  onClick: PropTypes.func,
  text: PropTypes.string,
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

Item.defaultProps = {
  buttons: null,
  onClick: null,
  text: '',
};


Item.propTypes = propTypes;

export default Item;
