import { FC, useContext } from 'react';
import { useIntl } from 'react-intl';

import { SettingsContext } from '../../../layout/SettingsProvider';
import SideBySide from '../../../common/SideBySide/SideBySide';
import { updateSettings } from '../../../../lib/service-clients/settings-client';

interface IRestrictionActions {
  onClose: Function,
}

const RestrictionActions: FC<IRestrictionActions> = ({ onClose }) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);

  const itemStyle = {
    background: settings?.styles?.trackBackgroundColor,
    color: settings?.styles?.fontColor,
    margin: '3px',
  }

  const actions = [
    [
      {
        text: intl.formatMessage({ id: 'enable' }),
        active: false,
        action: () => {},
        style: itemStyle
      },
      {
        text: intl.formatMessage({ id: 'edit' }),
        active: false,
        action: () => {},
        style: itemStyle
      },
    ],
    [
      {
        text: intl.formatMessage({ id: 'delete' }),
        action: () => onClose(),
        style: itemStyle
      },
      {
        text: intl.formatMessage({ id: 'cancel' }),
        action: () => onClose(),
        style: itemStyle
      },
    ],
  ]

  return <SideBySide data={actions}  />;
};

export default RestrictionActions;
