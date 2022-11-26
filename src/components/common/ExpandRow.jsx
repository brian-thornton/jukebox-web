import React, { useContext, useState } from 'react';
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

const ExpandRow = ({ buttons, text, isExpanded, setIsExpanded }) => {
  const settings = useContext(SettingsContext);
  const [activeKey, setActiveKey] = useState(isExpanded ? '0' : null);

  function CustomToggle({ children, eventKey, setIsExpanded }) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      setActiveKey(activeKey ? null : eventKey);
      if (setIsExpanded) {
        setIsExpanded(true);
      }
    });

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
    <Accordion activeKey={activeKey} style={{ width: '100%' }}>
      <CustomToggle eventKey="0" setIsExpanded={setIsExpanded}>{text}</CustomToggle>
      <Accordion.Collapse eventKey="0">
        <div onClick={() => setActiveKey(null)}>
          {buttons}
        </div>
      </Accordion.Collapse>
    </Accordion>
  );
}

ExpandRow.defaultProps = {
  buttons: null,
  text: '',
};


ExpandRow.propTypes = propTypes;

export default ExpandRow;
