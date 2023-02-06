import Col from 'react-bootstrap/Col';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import ControlButton from '../common/ControlButton';
import { SettingsContext } from '../layout/SettingsProvider';
import './AlbumAdminButtons.scss';

const propTypes = {
  setIsCustomSearchOpen: PropTypes.func.isRequired,
  setIsConfirmRemoveCoverArtOpen: PropTypes.func.isRequired,
  setConfirmRestriction: PropTypes.func.isRequired,
};

const AlbumAdminButtons = ({
  setIsCustomSearchOpen, setIsConfirmRemoveCoverArtOpen, setConfirmRestriction,
}) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';
  const colLayout = ((!controlButtonSize || controlButtonSize === 'small') && !isScreenSmall);

  const albumButton = (onClick, name) => (
    <Col lg={colLayout ? '6' : '12'} xl={colLayout ? '6' : '12'} sm="12" xs="12" className="adminRow">
      <ControlButton
        onClick={onClick}
        text={name}
        width="100%"
        height={buttonHeight}
        className="albumControlButton"
        style={{ fontSize }}
      />
    </Col>
  );

  return (
    <>
      {settings.features.admin && (
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

AlbumAdminButtons.propTypes = propTypes;

export default AlbumAdminButtons;
