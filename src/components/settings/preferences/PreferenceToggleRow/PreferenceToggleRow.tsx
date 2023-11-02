import { FC, useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../Button';
import Item from '../../../common/Item/Item';
import { SettingsContext } from '../../../layout/SettingsProvider';
import { updatePreference } from '../../../../lib/helper/preferenceHelper';

interface IPreferenceToggleRow {
  name: string,
  value: string | boolean | undefined,
  openToggle: Function,
  onClose?: Function,
}

const PreferenceToggleRow: FC<IPreferenceToggleRow> = ({ name, value, openToggle, onClose }) => {
  const settings = useContext(SettingsContext);
  const { screen } = settings;
  const buttonText = <FormattedMessage id={value ? 'enabled' : 'disabled'} />;
  const [showToggleActions, setShowToggleActions] = useState(false);

  const rowLabel = (labelText: any) => {
    const result = labelText.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  return (
    <Item
      onClick={() => {
        if (screen?.isMobile) {
          setShowToggleActions(true);
          openToggle(name, value);
        }
      }}
      buttons={(
        <Button
          onClick={() => {
            updatePreference(settings, name, !value, '/settings?mode=preferences');
          }}
          isToggle
          isToggled={value === 'true'}
          content={buttonText}
        />
      )}
      text={rowLabel(name)}
    />
  );
};

export default PreferenceToggleRow;
