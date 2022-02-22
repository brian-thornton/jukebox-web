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
    width: '95%',
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
    borderColor: '#708090',
    fontFamily: settings.styles.listFont,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '0px',
    marginBottom: '0px',
    paddingTop: '2px',
    paddingBottom: '2px'
  };

  return (
    <ListGroupItem onClick={onClick} style={itemStyle}>
      <div style={{ float: 'left', marginTop: '10px' }}>
      {text}
      </div>
      <div style={{ float: 'right' }}>
        {buttons}
      </div>
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
