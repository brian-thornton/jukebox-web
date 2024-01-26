import { FormattedMessage, useIntl } from 'react-intl';
import { FC, useState } from 'react';

import { deleteSkin, createSkin } from '../../../../lib/service-clients/style-client';
import Button from '../../../common/Buttons/Button/Button';
import NameInput from '../../../common/NameInput/NameInput';
import { ISkin } from '../../../interface';

import ToggleRow from '../../features/FeatureToggleRow/FeatureToggleRow';
import classes from './SkinPreferences.module.css';

interface ISkinPreferences {
  skin: ISkin,
  onClose: Function,
}

const SkinPreferences: FC<ISkinPreferences> = ({ skin, onClose }) => {
  const intl = useIntl();
  const [navButtonType, setNavButtonType] = useState(skin.navButtonType || 'buttons');
  const [navButtonSize, setNavButtonSize] = useState(skin.navButtonSize || 'small');
  const [buttonShape, setButtonShape] = useState(skin.buttonShape || 'rectangle');
  const [controlButtonSize, setControlButtonSize] = useState(skin.controlButtonSize || 'small');
  const [controlUseBackground, setControlUseBackground] = useState(skin.controlUseBackground || false);
  const [updatedName, setUpdatedName] = useState();

  const saveSkin = (newName = skin.name) => {
    deleteSkin(skin.name).then(() => {
      const { name, ...colors } = skin;

      const updatedSkin = {
        name: newName,
        skin: {
          ...colors,
          name: newName,
          navButtonType,
          navButtonSize,
          controlButtonSize,
          buttonShape,
          controlUseBackground,
        },
      };

      createSkin(updatedSkin).then(() => { });
    });
  };

  return (
    <div className={classes.skinPreferencesContainer}>
      <Button content={<FormattedMessage id="back_to_skin" />} width="100" onClick={onClose} />
      <div className={classes.skinPreferencesContainer}>
        <div className={classes.preferenceRow}>
          <div className={classes.skinPreferencesContainer}>
            <NameInput
              disabled={!skin.isEditable}
              defaultValue={skin.name}
              onChange={(e: any) => setUpdatedName(e.target.value)}
            />
          </div>
          <Button
            content={<FormattedMessage id="save" />}
            onClick={() => saveSkin(updatedName)}
            disabled={!skin.isEditable}
            width="100"
            height="20"
          />
        </div>
        <ToggleRow
          description={intl.formatMessage({ id: 'button_shape' })}
          keys={['rectangle', 'round']}
          selectedKey={buttonShape}
          onSetKey={(value: any) => setButtonShape(value)}
        />
        <ToggleRow
          description={intl.formatMessage({ id: 'navigation_link_style' })}
          keys={['links', 'buttons']}
          selectedKey={navButtonType}
          onSetKey={(value: any) => setNavButtonType(value)}
        />
        <ToggleRow
          description={intl.formatMessage({ id: 'navigation_button_size' })}
          keys={['small', 'medium', 'large']}
          selectedKey={navButtonSize}
          onSetKey={(value: any) => setNavButtonSize(value)}
        />
        <ToggleRow
          description={intl.formatMessage({ id: 'control_button_size' })}
          keys={['small', 'medium', 'large']}
          selectedKey={controlButtonSize}
          onSetKey={(value: any) => setControlButtonSize(value)}
        />
        <ToggleRow
          description={intl.formatMessage({ id: 'use_background' })}
          keys={['on', 'off']}
          // @ts-ignore
          selectedKey={controlUseBackground}
          onSetKey={(value: any) => setControlUseBackground(value)}
        />
      </div>
    </div >
  );
};

export default SkinPreferences;
