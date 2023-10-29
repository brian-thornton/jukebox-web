import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FC, useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import { IAlbum } from '../../interface';
import Button from '../../Button';
import NameInput from '../../common/NameInput/NameInput';
import { saveCoverArt } from '../../../lib/service-clients/librarian-client';
import './CoverArtSearchModal.scss';
import { SettingsContext } from '../../layout/SettingsProvider';

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
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;

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

  const resultsStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings?.styles?.fontColor,
  };

  return (
    <div className="cover-art-search">
      <Container>
        <Row className="cover-art-search-center">
          <NameInput defaultValue={album.name} onChange={(e: any) => setQuery(e.target.value)} />
        </Row>
        {!isLoading && results && (
          <Row className="cover-art-search-center">
            <Col>
              <Card className="cover-art-search-center albumCover" style={resultsStyle}>
                <Card.Title><FormattedMessage id="results" /></Card.Title>
                <Card.Img className="cover-art-search-album-cover" src={results} onClick={handleSave} />
              </Card>
            </Col>
          </Row>
        )}
        <Row className="cover-art-search-center">
          <Button disabled={isLoading} onClick={handleSearch} content={<FormattedMessage id="search" />} />
          <Button disabled={isLoading} onClick={handleClose} content={<FormattedMessage id="cancel" />} />
        </Row>
      </Container>
    </div>
  );
};

export default CoverArtSearchModal;
