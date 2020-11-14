import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import {
  Alert,
  Button,
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import Album from './Album';
import { Settings } from './shapes';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
  settings: Settings.isRequired,
};

function AlbumList({ search, setCurrentAlbum, settings }) {
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(100);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [alertText, setAlertText] = useState('Loading albums...');
  const isScreenSmall = window.innerWidth < 700;

  const loadAlbums = (targetHeight) => {
    setIsLoading(true);
    if (search) {
      setAlbums([]);
      setAlertText('Searching...');
      LibrianClient.searchAlbums(search).then((data) => {
        if (!data.length) {
          setAlertText('No results found.');
        } else {
          setAlbums(data);
        }
        window.scrollTo(0, targetHeight - 300);
        setIsLoading(false);
        setIsLoaded(true);
      });
    } else {
      LibrianClient.getAlbums(start, limit).then((data) => {
        if (start === 0) {
          if (!data.length) {
            setAlertText('No albums found. Set up your library in settings.');
            setIsLoaded(true);
          }
          setAlbums(data);
        } else {
          setAlbums(albums.concat(data));
        }

        window.scrollTo(0, targetHeight - 300);
        setStart(limit + 1);
        setLimit(limit + 100);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    if (!search) {
      setAlbums([]);
    }

    if (!isLoading) {
      setStart(0);
      setLimit(100);
      loadAlbums();
    }
  }, [search]);

  const loadMore = () => {
    setStart(limit);
    setLimit(limit + 100);
    loadAlbums(document.getElementById('albums').clientHeight);
  };

  const loadButton = () => {
    if (!search) {
      return <Button block variant="outline-info" onClick={loadMore}>Load More</Button>;
    }

    return <React.Fragment />;
  };

  if (!albums.length && !isLoading && !isLoaded) {
    loadAlbums();
  }

  const albumsMargin = () => {
    if (isScreenSmall) {
      return {};
    } else {
      return { marginLeft: '50px' };
    }
  };

  if (albums.length) {
    const renderAlbums = [];
    albums.forEach((album) => {
      renderAlbums.push(
        <Album
          album={album}
          setCurrentAlbum={setCurrentAlbum}
          settings={settings}
        />,
      );
    });

    return (
      <Container id="albums" fluid style={albumsMargin()}>
        <Row>
          {renderAlbums}
        </Row>
        <Row>
          {loadButton()}
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid style={albumsMargin()}>
      <Row>
        <Col lg={12} xl={12}>
          <Alert variant="primary">{alertText}</Alert>
        </Col>
      </Row>
    </Container>
  );
}

AlbumList.propTypes = propTypes;

AlbumList.defaultProps = {
  search: '',
};

export default AlbumList;
