import { FC } from 'react';
import { useIntl } from 'react-intl';

import SideBySide from '../../../common/SideBySide/SideBySide';

interface IRestrictionActions {
  onClose: Function,
}

const RestrictionActions: FC<IRestrictionActions> = ({ onClose }) => {
  const intl = useIntl();

  const actions = [
    {
      text: intl.formatMessage({ id: 'enable' }),
      active: false,
      action: () => { },
    },
    {
      text: intl.formatMessage({ id: 'edit' }),
      active: false,
      action: () => { },
    },
    {
      text: intl.formatMessage({ id: 'delete' }),
      action: () => onClose(),
    },
    {
      text: intl.formatMessage({ id: 'cancel' }),
      action: () => onClose(),
    },
  ];

  return <SideBySide data={actions} />;
};

export default RestrictionActions;
