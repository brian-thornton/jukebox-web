import { FC, useContext } from 'react';
import { useIntl } from 'react-intl';

import { SettingsContext } from '../layout/SettingsProvider';
import SideBySide from '../common/SideBySide/SideBySide';

interface ISettingsActions {
  onClose: Function,
  applyPadding?: boolean,
  setMode: Function,
}

const SettingsActions: FC<ISettingsActions> = ({ setMode, onClose, applyPadding = false }) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);

  const itemStyle = {
    background: settings?.styles?.trackBackgroundColor,
    color: settings?.styles?.fontColor,
    margin: '3px',
  }

  const selectMode = (mode: string) => {
    setMode(mode);
    onClose();
  };

  const actions = [
    [
      { text: intl.formatMessage({ id: 'library' }), action: () => selectMode('LIBRARY'), style: itemStyle },
      { text: intl.formatMessage({ id: 'preferences' }), action: () => selectMode('PREFERENCES'), style: itemStyle },
    ],
    [
      { text: intl.formatMessage({ id: 'access' }), action: () => selectMode('ACCESS'), style: itemStyle },
      { text: intl.formatMessage({ id: 'style' }), action: () => selectMode('STYLE'), style: itemStyle },
    ],
    [
      { text: intl.formatMessage({ id: 'restrictions' }), action: () => selectMode('RESTRICTIONS'), style: itemStyle },
      { text: intl.formatMessage({ id: 'logs' }), action: () => selectMode('LOGS'), style: itemStyle },
    ],
    [
      { text: intl.formatMessage({ id: 'metadata' }), action: () => selectMode('METADATA'), style: itemStyle }, 
      { text: intl.formatMessage({ id: 'categories' }), action: () => selectMode('CATEGORIES'), style: itemStyle },
    ],
    [
      { text: intl.formatMessage({ id: 'cabinet' }), action: () => selectMode('CABINET'), style: itemStyle },
    ]
  ]


  return (
    <SideBySide data={actions} />
  );
};

export default SettingsActions;
