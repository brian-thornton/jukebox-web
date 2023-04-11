import { FC, useContext, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import { SettingsContext } from '../layout/SettingsProvider';
import './ExpandRow.scss';

interface IExpandRow {
  buttons: any,
  text: string,
  isExpanded: boolean,
  setIsExpanded: Function,
};

const ExpandRow: FC<IExpandRow> = ({
  buttons, text, isExpanded, setIsExpanded,
}) => {
  const settings = useContext(SettingsContext);
  const [activeKey, setActiveKey] = useState(isExpanded ? '0' : null);

  interface ICustomToggle {
    children: any,
    eventKey: string,
    setIsExpanded: Function,
  };

  const CustomToggle: FC<ICustomToggle> = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      setActiveKey(activeKey ? null : eventKey);
      if (setIsExpanded) {
        setIsExpanded(true);
      }
    });

    const itemStyle = {
      color: settings?.styles?.fontColor,
      background: settings?.styles?.trackBackgroundColor,
      fontFamily: settings?.styles?.listFont,
    };

    return (
      <button
        className="accordionHeader"
        style={itemStyle}
        type="button"
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

  return (
    <Accordion activeKey={activeKey} className="accordion">
      <CustomToggle eventKey="0" setIsExpanded={setIsExpanded}>{text}</CustomToggle>
      <Accordion.Collapse eventKey="0">
        <div onClick={() => setActiveKey(null)}>
          {buttons}
        </div>
      </Accordion.Collapse>
    </Accordion>
  );
};

export default ExpandRow;
