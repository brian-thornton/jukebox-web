import { FC, useContext } from 'react';
import { useIntl } from 'react-intl';

import { SettingsContext } from '../../layout/SettingsProvider';
import SideBySide from '../../common/SideBySide';

interface ILibraryMenuMobile {
  onClose: Function,
};

const LibraryMenuMobile: FC<ILibraryMenuMobile> = ({ onClose }) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);

  const itemStyle = {
    background: settings?.styles?.trackBackgroundColor,
    color: settings?.styles?.fontColor,
    margin: '3px',
  }

  const actions = [
    [
      { text: 'Show Online', action: () => {}, style: itemStyle },
      { text: 'Categories', action: () => {}, style: itemStyle },
    ],
    [
      { text: 'Scan All', action: () => {}, style: itemStyle },
      { text: 'Delete All', action: () => {}, style: itemStyle },
    ],
    [
      { text: 'Discover', action: () => {}, style: itemStyle },
      { text: 'Add', action: () => {}, style: itemStyle },
    ],
    [
      { text: 'Cancel', action: () => onClose(), style: itemStyle }, 
    ]
  ]

  return (
    <SideBySide data={actions} />
  );
};

export default LibraryMenuMobile;
