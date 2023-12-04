import { FC, useContext } from 'react';
import { useIntl } from 'react-intl';

import { SettingsContext } from '../../../layout/SettingsProvider';
import SideBySide from '../../../common/SideBySide/SideBySide';
import { updatePreference } from '../../../../lib/helper/preferenceHelper';

interface IToggleActions {
  onClose: Function,
  applyPadding?: boolean,
  value: boolean,
  name: string,
}

const ToggleActions: FC<IToggleActions> = ({ name, onClose, value }) => {
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
    {
      text: intl.formatMessage({ id: 'on' }),
      active: value === true,
      action: () => updatePreferenceAndClose(),
      style: itemStyle
    },
    {
      text: intl.formatMessage({ id: 'off' }),
      active: value === false,
      action: () => updatePreferenceAndClose(),
      style: itemStyle
    },
    {
      text: intl.formatMessage({ id: 'cancel' }),
      action: () => onClose(),
      style: itemStyle
    },
  ];

  return <SideBySide data={actions} title={name} />;
};

export default ToggleActions;
