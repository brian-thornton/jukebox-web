import React, { useEffect, useState, useContext } from 'react';
import {
  Row,
  Col,
} from 'react-bootstrap';

import ControlButton from '../common/ControlButton';
import CoverArtSearchModal from './CoverArtSearchModal';
import { coverArtUrl, saveCoverArt, removeCoverArt } from '../../lib/librarian-client';
import { Album } from '../shapes';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  album: Album.isRequired,
};

function AlbumAdminButtons({ album }) {
  const settings = useContext(SettingsContext);
  const [coverArt, setCoverArt] = useState('');
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);
  const saveCoverArtToLibrary = () => saveCoverArt({ album, url: coverArt });

  useEffect(() => setCoverArt(coverArtUrl(album)), []);

  const albumButton = (onClick, name) => (
    <Col lg={6} style={{ padding: '0px' }}>
      <ControlButton onClick={onClick} text={name} />
    </Col>
  );

  const adminButtons = () => {
    if (settings.features.admin) {
      return (
        <>
          <Row>
            {albumButton(() => removeCoverArt(album), 'Remove Cover')}
            {albumButton(() => setCoverArt(coverArtUrl(album)), 'Refresh Cover')}
          </Row>
          <Row>
            {albumButton(() => setIsCustomSearchOpen(true), 'Custom Search')}
            {albumButton(saveCoverArtToLibrary, 'Save Cover Art')}
          </Row>
        </>
      );
    }

    return <React.Fragment />;
  };

  return (
    <>
      {adminButtons()}
      <CoverArtSearchModal
        album={album}
        isOpen={isCustomSearchOpen}
        handleClose={() => setIsCustomSearchOpen(false)}
      />
    </>
  );
}

AlbumAdminButtons.propTypes = propTypes;

export default AlbumAdminButtons;
