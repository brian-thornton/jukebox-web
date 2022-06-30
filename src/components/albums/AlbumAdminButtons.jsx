import Col from 'react-bootstrap/Col';
import React, { useEffect, useState, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import ControlButton from '../common/ControlButton';
import CoverArtSearchModal from './CoverArtSearchModal';
import { coverArtUrl, saveCoverArt, removeCoverArt } from '../../lib/librarian-client';
import { Album } from '../shapes';
import { SettingsContext } from '../layout/SettingsProvider';
import styles from './AlbumAdminButtons.module.css';

const propTypes = {
  album: Album.isRequired,
};

const AlbumAdminButtons = ({ album }) => {
  const settings = useContext(SettingsContext);
  const [coverArt, setCoverArt] = useState('');
  const [isCustomSearchOpen, setIsCustomSearchOpen] = useState(false);
  const isScreenSmall = window.innerWidth < 700;
  const saveCoverArtToLibrary = () => {
    saveCoverArt({ album, url: coverArt });
  }

  useEffect(() => {
    coverArtUrl(album).then(data => setCoverArt(data.url));
  }, []);

  const albumButton = (onClick, name) => (
    <Col lg={6} className={styles.adminButton}>
      <ControlButton onClick={onClick} text={name} height={50} />
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
