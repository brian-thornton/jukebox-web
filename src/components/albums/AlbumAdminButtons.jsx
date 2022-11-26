import Col from 'react-bootstrap/Col';
import React, { useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import ControlButton from '../common/ControlButton';
import { coverArtUrl, saveCoverArt, removeCoverArt } from '../../lib/librarian-client';
import { Album } from '../shapes';
import { SettingsContext } from '../layout/SettingsProvider';
import './AlbumAdminButtons.scss';

const propTypes = {
  album: Album.isRequired,
};

const AlbumAdminButtons = ({ album, setIsCustomSearchOpen, setIsConfirmRemoveCoverArtOpen, setConfirmRestriction }) => {
  const settings = useContext(SettingsContext);
  const [coverArt, setCoverArt] = useState('');
  const isScreenSmall = window.innerWidth < 700;
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : '50';
  const fontSize = (!controlButtonSize || controlButtonSize === 'small') ? '' : '25px';
  const colLayout = ((!controlButtonSize || controlButtonSize === 'small') && !isScreenSmall);

  const saveCoverArtToLibrary = () => {
    saveCoverArt({ album, url: coverArt });
  }

  useEffect(() => {
    coverArtUrl(album).then(data => setCoverArt(data.url));
  }, []);

  const albumButton = (onClick, name) => (
    <Col lg={colLayout ? "6" : "12"} xl={colLayout ? "6" : "12"} sm="12" xs="12" className="adminRow">
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
}

AlbumAdminButtons.propTypes = propTypes;

export default AlbumAdminButtons;
