import { FC, useCallback, useContext } from 'react';
import { debounce } from 'lodash';

import { SettingsContext } from '../../../layout/SettingsProvider';
import NameInput from '../../../common/NameInput/NameInput';
import classes from './PreferenceTextRow.module.css';
import { updatePreference } from '../../../../lib/helper/preferenceHelper';

interface IPreferenceTextRow {
  rowName: string,
  value?: string,
}

const PreferenceTextRow: FC<IPreferenceTextRow> = ({ rowName, value }) => {
  const settings = useContext(SettingsContext);

  const rowLabel = (labelText: string) => {
    const result = labelText.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  const debouncedUpdate = useCallback(
    debounce((event) => {
      updatePreference(settings, rowName, event.target.value, '/settings?mode=preferences');
    }, 1000), [],
  );

  return (
    <div className={classes.preferenceTextRowContainer}>
      <NameInput
        name={rowLabel(rowName)}
        defaultValue={value}
        onChange={debouncedUpdate}
      />
    </div>
  );
};

export default PreferenceTextRow;
