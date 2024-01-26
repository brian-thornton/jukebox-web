import { FC, useContext } from 'react';
import { useIntl } from 'react-intl';

import { SettingsContext } from '../../../layout/SettingsProvider';
import SideBySide from '../../../layout/SideBySide/SideBySide';
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

  const updatePreferenceAndClose = () => {
    updatePreference(settings, name, !value, '/settings?mode=preferences');
    onClose();
  }

  const actions = [
    {
      text: intl.formatMessage({ id: 'on' }),
      active: value === true,
      action: () => updatePreferenceAndClose(),
    },
    {
      text: intl.formatMessage({ id: 'off' }),
      active: value === false,
      action: () => updatePreferenceAndClose(),
    },
    {
      text: intl.formatMessage({ id: 'cancel' }),
      action: () => onClose(),
    },
  ];

  return <SideBySide data={actions} title={name} />;
};

export default ToggleActions;
