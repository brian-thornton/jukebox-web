import React, { useState } from 'react';
import {
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import CoverArtSearchModal from './CoverArtSearchModal';
import LibrianClient from '../lib/librarian-client';
import defaultCover from '../default_album.jpg';
import { Album, Settings } from './shapes';

const albumArt = require('album-art');

const propTypes = {
  album: Album.isRequired,
  settings: Settings.isRequired,
};

function AlbumAdminButtons({ album, settings }) {
  const [coverArt, setCoverArt] = useState('');
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);

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

  const saveCoverArtToLibrary = () => LibrianClient.saveCoverArt({ album, url: coverArt });
  const removeCoverArt = () => LibrianClient.removeCoverArt(album);

  const adminButtons = () => {
    const props = {
      block: true,
      variant: 'outline-light',
      style: {
        background: settings.styles.buttonBackgroundColor,
        color: settings.styles.fontColor,
      },
    };

    if (settings.features.admin) {
      return (
        <React.Fragment>
          <Row>
            <Col lg={6} style={{ padding: '0px' }}>
              <Button {...props} onClick={removeCoverArt}>Remove Cover</Button>
            </Col>
            <Col lg={6} style={{ padding: '0px' }}>
              <Button {...props} onClick={getCoverArt}>Refresh Cover</Button>
            </Col>
          </Row>
          <Row>
            <Col lg={6} style={{ padding: '0px' }}>
              <Button {...props} onClick={() => setIsCustomSearchOpen(true)}>Custom Search</Button>
            </Col>
            <Col lg={6} style={{ padding: '0px' }}>
              <Button {...props} onClick={saveCoverArtToLibrary}>Save Cover Art</Button>
            </Col>
          </Row>
        </React.Fragment>
      );
    }

    return <React.Fragment />;
  };

  return (
    <React.Fragment>
      { adminButtons()}
      <CoverArtSearchModal
        settings={settings}
        album={album}
        isOpen={isCustomSearchOpen}
        handleClose={() => setIsCustomSearchOpen(false)}
      />
    </React.Fragment>
  );
}

AlbumAdminButtons.propTypes = propTypes;

export default AlbumAdminButtons;
