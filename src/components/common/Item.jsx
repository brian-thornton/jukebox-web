import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

import CheckToggle from '../common/CheckToggle';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from './Item.module.css';

const propTypes = {
  buttons: PropTypes.node,
  onClick: PropTypes.func,
  text: PropTypes.string,
};

const Item = ({ buttons, onClick, text, includeCheckbox, onCheck, checked }) => {
  const settings = useContext(SettingsContext);

  const itemStyle = {
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
    fontFamily: settings.styles.listFont,
    width: '100%',
  };

  return (
    <ListGroupItem className={styles.itemStyle} style={itemStyle} onClick={onClick}>
      <div className={styles.itemText}>
        {includeCheckbox && <CheckToggle isChecked={checked} onClick={onCheck} />}
        {text}
      </div>
      <div className={styles.itemButtons}>
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
