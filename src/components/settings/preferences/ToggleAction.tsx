import { FC, useContext } from 'react';
import { useIntl } from 'react-intl';

import { SettingsContext } from '../../layout/SettingsProvider';
import SideBySide from '../../common/SideBySide';
import { updatePreference } from '../../../lib/preferenceHelper';

interface IToggleActions {
  onClose: Function,
  applyPadding?: boolean,
  value: string,
  name: string,
};

const ToggleActions: FC<IToggleActions> = ({name, onClose, applyPadding = false, value }) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);

  const itemStyle = {
    background: settings?.styles?.trackBackgroundColor,
    color: settings?.styles?.fontColor,
    margin: '3px',
  }

  const updatePreferenceAndClose = () => {
    updatePreference(settings, name, !value, '/settings?mode=preferences');
    onClose();
  }

  const actions = [
    [
      { text: intl.formatMessage({ id: 'on' }), action: () => updatePreferenceAndClose(), style: itemStyle },
      { text: intl.formatMessage({ id: 'off' }), action: () => updatePreferenceAndClose(), style: itemStyle },
    ],
    [
      { text: intl.formatMessage({ id: 'cancel' }), action: () => onClose(), style: itemStyle },
    ],
  ]


  return (
    <SideBySide data={actions} title={name} />
  );
};

export default ToggleActions;
