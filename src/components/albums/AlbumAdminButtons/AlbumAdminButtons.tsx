import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import ControlButton from '../../common/Buttons/ControlButton/ControlButton';
import { SettingsContext } from '../../layout/SettingsProvider';
import classes from './AlbumAdminButtons.module.css';

interface IAlbumAdminButtons {
  setIsCustomSearchOpen: Function,
  setIsConfirmRemoveCoverArtOpen: Function,
  setConfirmRestriction: Function,
}

const AlbumAdminButtons: FC<IAlbumAdminButtons> = ({
  setIsCustomSearchOpen, setIsConfirmRemoveCoverArtOpen, setConfirmRestriction,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall, styles } = settings || {};
  const { controlButtonSize } = styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const colLayout = ((!controlButtonSize || controlButtonSize === 'small') && !isScreenSmall);

  const albumButton = (onClick: any, name: any) => (
    <div className={classes.albumButton}>
      <ControlButton
        onClick={onClick}
        text={name}
        width="100%"
        height={buttonHeight}
        disabled={false}
      />
    </div>
  );

  const coverControls = (
    <>
      {albumButton(() => setIsCustomSearchOpen(true), <FormattedMessage id="cover_search" />)}
      {albumButton(() => setIsConfirmRemoveCoverArtOpen(true), <FormattedMessage id="remove_cover" />)}
    </>
  );

  return settings?.features?.admin && !isScreenSmall ? (
    <>
      {colLayout && (
        <>
          <div className={classes.buttonRow}>
            {coverControls}
          </div>
          <div className={classes.buttonRow}>
            {albumButton(() => setConfirmRestriction(true), <FormattedMessage id="restrict_content" />)}
          </div>
        </>
      )}
      {!colLayout && (
        <div className={classes.buttonRow}>
          {coverControls}
          {albumButton(() => setConfirmRestriction(true), <FormattedMessage id="restrict_content" />)}
        </div>
      )}
    </>
  ) : null;
};

export default AlbumAdminButtons;
