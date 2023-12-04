import { FC, useContext } from 'react';

import { SettingsContext } from '../../../layout/SettingsProvider';
import SideBySide from '../../../common/SideBySide/SideBySide';

interface ILibraryMenuMobile {
  onClose: Function,
  setShowOnline: Function,
  showOnline: boolean,
}

const LibraryMenuMobile: FC<ILibraryMenuMobile> = ({ onClose, showOnline, setShowOnline }) => {
  const settings = useContext(SettingsContext);

  const itemStyle = {
    background: settings?.styles?.trackBackgroundColor,
    color: settings?.styles?.fontColor,
    margin: '3px',
  }

  const actions = [
    {
      text: 'Show Online', action: () => {
        setShowOnline(!showOnline);
        onClose();
      }, style: itemStyle
    },
    { text: 'Categories', action: () => { }, style: itemStyle },
    { text: 'Scan All', action: () => { }, style: itemStyle },
    { text: 'Delete All', action: () => { }, style: itemStyle },
    { text: 'Discover', action: () => { }, style: itemStyle },
    { text: 'Add', action: () => { }, style: itemStyle },
    { text: 'Cancel', action: () => onClose(), style: itemStyle },
  ];

  return (
    <SideBySide data={actions} />
  );
};

export default LibraryMenuMobile;
