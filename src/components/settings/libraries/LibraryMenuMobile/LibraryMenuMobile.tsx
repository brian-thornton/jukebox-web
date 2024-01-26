import { FC } from 'react';

import SideBySide from '../../../layout/SideBySide/SideBySide';

interface ILibraryMenuMobile {
  onClose: Function,
  setShowOnline: Function,
  showOnline: boolean,
}

const LibraryMenuMobile: FC<ILibraryMenuMobile> = ({ onClose, showOnline, setShowOnline }) => {
  const actions = [
    {
      text: 'Show Online', action: () => {
        setShowOnline(!showOnline);
        onClose();
      },
    },
    { text: 'Categories', action: () => { }},
    { text: 'Scan All', action: () => { } },
    { text: 'Delete All', action: () => { }},
    { text: 'Discover', action: () => { }},
    { text: 'Add', action: () => { }},
    { text: 'Cancel', action: () => onClose()},
  ];

  return (
    <SideBySide data={actions} /> 
  );
};

export default LibraryMenuMobile;
