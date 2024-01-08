import Card from 'react-bootstrap/Card';
import { FC, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { IAlbum } from '../../interface';
import Button from '../../common/Button/Button';
import NameInput from '../../common/NameInput/NameInput';
import { saveCoverArt } from '../../../lib/service-clients/librarian-client';
import styles from './CoverArtSearchModal.module.css';

const albumArt = require('album-art');

interface ICoverArtSearchModal {
  handleClose: Function,
  album: IAlbum,
}

const CoverArtSearchModal: FC<ICoverArtSearchModal> = ({
  handleClose, album,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState();
  const [query, setQuery] = useState(album.name);
  const saveCoverArtToLibrary = () => saveCoverArt({ album, url: results });

  const handleResult = (data: any) => {
    if (data.toString().includes('http')) {
      setResults(data);
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    if (query.includes('-')) {
      const nameArray = query.split('-');
      albumArt(nameArray[0], { album: nameArray[1] }).then((data: any) => {
        handleResult(data);
        setIsLoading(false);
      });
    } else {
      albumArt(query).then((data: any) => {
        handleResult(data);
        setIsLoading(false);
      });
    }
  };

  const handleSave = () => {
    saveCoverArtToLibrary();
    handleClose();
  };

  return (
    <div className={styles.coverArtSearch}>
      <div className={styles.coverArtSearchContainer}>
        <div className={styles.coverArtSearchCenter}>
          <NameInput defaultValue={album.name} onChange={(e: any) => setQuery(e.target.value)} />
        </div>
        {!isLoading && results && (
          <div className={styles.coverArtSearchCenter}>
            <Card className={`${styles.coverArtSearchCenter} ${styles.albumCover}`}>
              <Card.Title><FormattedMessage id="results" /></Card.Title>
              <Card.Img className={styles.coverArtSearchAlbumCover} src={results} onClick={handleSave} />
            </Card>
          </div>
        )}
        <div className={styles.coverArtSearchCenter}>
          <Button disabled={isLoading} onClick={handleSearch} content={<FormattedMessage id="search" />} />
          <Button disabled={isLoading} onClick={handleClose} content={<FormattedMessage id="cancel" />} />
        </div>
      </div>
    </div>
  );
};

export default CoverArtSearchModal;
