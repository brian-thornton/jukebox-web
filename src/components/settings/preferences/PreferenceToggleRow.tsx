import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../Button';
import Item from '../../common/Item';
import { SettingsContext } from '../../layout/SettingsProvider';
import './PreferenceToggleRow.scss';
import { updatePreference } from '../../../lib/preferenceHelper';

interface IPreferenceToggleRow {
  name: string,
  value: string,
};

const PreferenceToggleRow: FC<IPreferenceToggleRow> = ({ name, value }) => {
  const settings = useContext(SettingsContext);
  const buttonText = <FormattedMessage id={value ? 'enabled' : 'disabled'} />;

  const rowLabel = (labelText: any) => {
    const result = labelText.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  return (
    <Item
      onClick={() => { }}
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
