import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Accordion } from 'react-bootstrap';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import { SettingsContext } from '../layout/SettingsProvider';
import './ExpandRow.scss';

const propTypes = {
  buttons: PropTypes.node,
  onClick: PropTypes.func,
  text: PropTypes.string,
};

const ExpandRow = ({ buttons, onClick, text }) => {
  const settings = useContext(SettingsContext);

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log('totally custom!'),
    );

  const itemStyle = {
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
    fontFamily: settings.styles.listFont,
  };

    return (
      <button
        className="accordionHeader" style={itemStyle}
        type="button"
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

  return (
    <Accordion>
      <CustomToggle eventKey="0">{text}</CustomToggle>
      <Accordion.Collapse eventKey="0">
        {buttons}
      </Accordion.Collapse>
    </Accordion>
  );
}

ExpandRow.defaultProps = {
  buttons: null,
  onClick: null,
  text: '',
};


ExpandRow.propTypes = propTypes;

export default ExpandRow;
