import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Form, ListGroupItem } from 'react-bootstrap';

import { SettingsContext } from '../layout/SettingsProvider';
import styles from './Item.module.css';

const propTypes = {
  buttons: PropTypes.node,
  onClick: PropTypes.func,
  text: PropTypes.string,
};

function Item({ buttons, onClick, text, includeCheckbox, onCheck, checked }) {
  const settings = useContext(SettingsContext);

  const itemStyle = {
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
    fontFamily: settings.styles.listFont,
  };

  return (
    <ListGroupItem className={styles.itemStyle} style={itemStyle} onClick={onClick}>
      <div className={styles.itemText}>
        {includeCheckbox && (
          <Form.Check
            checked={checked}
            type="checkbox"
            onClick={onCheck}
          >
          </Form.Check>
        )}
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
