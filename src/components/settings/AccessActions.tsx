import { FC, useContext } from 'react';
import { useIntl } from 'react-intl';

import { SettingsContext } from '../layout/SettingsProvider';
import SideBySide from '../common/SideBySide/SideBySide';
import { updateSettings } from '../../lib/service-clients/settings-client';

interface IAccessActions {
  onClose: Function,
  applyPadding?: boolean,
  value: boolean,
  name: string,
}

const AccessActions: FC<IAccessActions> = ({ name, onClose, value }) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);

  const updateFeatureAndClose = () => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.features[name] = !value;
    updateSettings(deepClone).then(() => {
      window.location.reload();
    });

    onClose();
  };

  const actions = [
      {
        text: intl.formatMessage({ id: 'on' }),
        active: value === true,
        action: () => updateFeatureAndClose(),
      },
      {
        text: intl.formatMessage({ id: 'off' }),
        active: value === false,
        action: () => updateFeatureAndClose(),
      },
      {
        text: intl.formatMessage({ id: 'cancel' }),
        action: () => onClose(),
      },
  ];

  return <SideBySide data={actions} title={name} />;
};

export default AccessActions;
