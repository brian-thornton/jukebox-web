import { FC } from 'react';
import { useIntl } from 'react-intl';

import SideBySide from '../layout/SideBySide/SideBySide';

interface ISettingsActions {
  onClose: Function,
  applyPadding?: boolean,
  setMode: Function,
}

const SettingsActions: FC<ISettingsActions> = ({ setMode, onClose, applyPadding = false }) => {
  const intl = useIntl();

  const selectMode = (mode: string) => {
    setMode(mode);
    onClose();
  };

  const actions = [
      { text: intl.formatMessage({ id: 'library' }), action: () => selectMode('LIBRARY')},
      { text: intl.formatMessage({ id: 'preferences' }), action: () => selectMode('PREFERENCES')},
      { text: intl.formatMessage({ id: 'access' }), action: () => selectMode('ACCESS')},
      { text: intl.formatMessage({ id: 'style' }), action: () => selectMode('STYLE')},
      { text: intl.formatMessage({ id: 'restrictions' }), action: () => selectMode('RESTRICTIONS')},
      { text: intl.formatMessage({ id: 'logs' }), action: () => selectMode('LOGS')},
      { text: intl.formatMessage({ id: 'metadata' }), action: () => selectMode('METADATA')}, 
      { text: intl.formatMessage({ id: 'categories' }), action: () => selectMode('CATEGORIES')},
      { text: intl.formatMessage({ id: 'cabinet' }), action: () => selectMode('CABINET')},
  ];

  return <SideBySide data={actions} />;
};

export default SettingsActions;
