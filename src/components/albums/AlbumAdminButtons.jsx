import Col from 'react-bootstrap/Col';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';

import ControlButton from '../common/ControlButton';
import { SettingsContext } from '../layout/SettingsProvider';
import './AlbumAdminButtons.scss';

const propTypes = {
  setIsCustomSearchOpen: PropTypes.func.isRequired,
  setIsConfirmRemoveCoverArtOpen: PropTypes.func.isRequired,
  setConfirmRestriction: PropTypes.func.isRequired,
};

const AlbumAdminButtons = ({
  setIsCustomSearchOpen,
  setIsConfirmRemoveCoverArtOpen,
  setConfirmRestriction,
}) => {
  const settings = useContext(SettingsContext);
  const isScreenSmall = window.innerWidth < 700;
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
        style={{ fontSize, marginTop: '0px', marginBottom: '0px' }}
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
                {albumButton(() => setIsCustomSearchOpen(true), 'Cover Search')}
                {albumButton(() => setIsConfirmRemoveCoverArtOpen(true), 'Remove Cover')}
              </Row>
              <Row>
                {albumButton(() => setConfirmRestriction(true), 'Restrict Content')}
              </Row>
            </>
          )}
          {!colLayout && (
            <Row>
              {albumButton(() => setIsCustomSearchOpen(true), 'Cover Search')}
              {albumButton(() => setIsConfirmRemoveCoverArtOpen(true), 'Remove Cover')}
              {albumButton(() => setConfirmRestriction(true), 'Restrict Content')}
            </Row>
          )}
        </>
      )}
    </>
  );
};

AlbumAdminButtons.propTypes = propTypes;

export default AlbumAdminButtons;
