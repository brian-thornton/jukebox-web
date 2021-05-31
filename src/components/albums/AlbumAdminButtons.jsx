import React, { useState, useContext } from 'react';
import {
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import CoverArtSearchModal from './CoverArtSearchModal';
import { saveCoverArt, removeCoverArt } from '../../lib/librarian-client';
import defaultCover from './default_album.jpg';
import { Album } from '../shapes';
import { controlButtonProps } from '../../lib/styleHelper';
import { SettingsContext } from '../layout/Jukebox';

const albumArt = require('album-art');

const propTypes = {
  album: Album.isRequired,
};

function AlbumAdminButtons({ album }) {
  const settings = useContext(SettingsContext);
  const [coverArt, setCoverArt] = useState('');
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);
  const saveCoverArtToLibrary = () => saveCoverArt({ album, url: coverArt });

  const getCoverArt = () => {
    const nameArray = album.name.split('-');

    albumArt(nameArray[0], { album: nameArray[1] }).then((data) => {
      if (data.toString().includes('http')) {
        setCoverArt(data);
      } else {
        setCoverArt(defaultCover);
      }
    });
  };

  getCoverArt();

  const albumButton = (onClick, name) => (
    <Col lg={6} style={{ padding: '0px' }}>
      <Button {...controlButtonProps(settings)} onClick={onClick}>{name}</Button>
    </Col>
  );

  const adminButtons = () => {
    if (settings.features.admin) {
      return (
        <React.Fragment>
          <Row>
            {albumButton(() => removeCoverArt(album), 'Remove Cover')}
            {albumButton(getCoverArt, 'Refresh Cover')}
          </Row>
          <Row>
            {albumButton(() => setIsCustomSearchOpen(true), 'Custom Search')}
            {albumButton(saveCoverArtToLibrary, 'Save Cover Art')}
          </Row>
        </React.Fragment>
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
