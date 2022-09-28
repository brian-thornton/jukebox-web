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

const AlbumAdminButtons = ({ album, setIsCustomSearchOpen }) => {
  const settings = useContext(SettingsContext);
  const [coverArt, setCoverArt] = useState('');
  const isScreenSmall = window.innerWidth < 700;
  const saveCoverArtToLibrary = () => {
    saveCoverArt({ album, url: coverArt });
  }

  useEffect(() => {
    coverArtUrl(album).then(data => setCoverArt(data.url));
  }, []);

  const albumButton = (onClick, name) => (
    <Col lg="6" xl="6" sm="12" xs="12" className="adminButton">
      <ControlButton onClick={onClick} text={name} width="100%" height={50} />
    </Col>
  );

  return (
    <>
      {settings.features.admin && (
        <>
          {!isScreenSmall && (
            <Row>
              {albumButton(() => setIsCustomSearchOpen(true), 'Cover Search')}
              {albumButton(() => removeCoverArt(album), 'Remove Cover')}
            </Row>
          )}
        </>
      )}
    </>
  );
}

AlbumAdminButtons.propTypes = propTypes;

export default AlbumAdminButtons;
