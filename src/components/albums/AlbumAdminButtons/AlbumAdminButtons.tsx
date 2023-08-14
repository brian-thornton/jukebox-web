import Col from 'react-bootstrap/Col';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { FormattedMessage } from 'react-intl';

import ControlButton from '../../common/ControlButton/ControlButton';
import { SettingsContext } from '../../layout/SettingsProvider';
import classes from './AlbumAdminButtons.module.css';

interface IAlbumAdminButtons {
  setIsCustomSearchOpen: Function,
  setIsConfirmRemoveCoverArtOpen: Function,
  setConfirmRestriction: Function,
};

const AlbumAdminButtons: FC<IAlbumAdminButtons> = ({
  setIsCustomSearchOpen, setIsConfirmRemoveCoverArtOpen, setConfirmRestriction,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall, styles } = settings || {};
  const {controlButtonSize} = styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';
  const colLayout = ((!controlButtonSize || controlButtonSize === 'small') && !isScreenSmall);

  const albumButton = (onClick: any, name: any) => (
    <Col lg={colLayout ? '6' : '12'} xl={colLayout ? '6' : '12'} sm="12" xs="12" className={classes.adminRow}>
      <ControlButton
        onClick={onClick}
        text={name}
        width="100%"
        height={buttonHeight}
        style={{ fontSize }}
        disabled={false}
      />
    </Col>
  );

  return (
    <>
      {settings?.features?.admin && !isScreenSmall && (
        <>
          {colLayout && (
            <>
              <Row>
                {albumButton(() => setIsCustomSearchOpen(true), <FormattedMessage id="cover_search" />)}
                {albumButton(() => setIsConfirmRemoveCoverArtOpen(true), <FormattedMessage id="remove_cover" />)}
              </Row>
              <Row>
                {albumButton(() => setConfirmRestriction(true), <FormattedMessage id="restrict_content" />)}
              </Row>
            </>
          )}
          {!colLayout && (
            <Row>
              {albumButton(() => setIsCustomSearchOpen(true), <FormattedMessage id="cover_search" />)}
              {albumButton(() => setIsConfirmRemoveCoverArtOpen(true), <FormattedMessage id="remove_cover" />)}
              {albumButton(() => setConfirmRestriction(true), <FormattedMessage id="restrict_content" />)}
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default AlbumAdminButtons;
