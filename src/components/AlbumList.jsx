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

function AlbumList({ search, setCurrentAlbum, settings, page, setPage }) {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [alertText, setAlertText] = useState('Loading albums...');
  const isScreenSmall = window.innerWidth < 700;

  const loadAlbums = () => {
    setIsLoading(true);
    setAlbums([]);

    if (search) {
      setAlbums([]);
      setAlertText('Searching...');
      LibrianClient.searchAlbums(search).then((data) => {
        if (!data.length) {
          setAlertText('No results found.');
        } else {
          setAlbums(data);
        }
        window.scrollTo(0, 0);
        setIsLoading(false);
        setIsLoaded(true);
      });
    } else {
      LibrianClient.getAlbums(page.start, page.limit).then((data) => {
        console.log(data);
        if (page.start === 0) {
          if (!data.length) {
            setAlertText('No albums found. Set up your library in settings.');
            setIsLoaded(true);
          }
          setAlbums(data);
        } else {
          setAlbums(data);
        }

        window.scrollTo(0, 0);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    if (!search) {
      setAlbums([]);
    }

    if (!isLoading) {
      setPage({
        start: 0,
        limit: 12
      });

      loadAlbums();
    }
  }, [search]);

  const loadMore = () => {
    setPage({
      start: page.limit,
      limit: page.limit + 12
    });
  };

  const loadPrevious = () => {
    let newStart = page.start - 12;
    if (newStart < 0) {
      newStart = 0;
    }

    let newLimit = page.limit - 12;
    if (newLimit < 12) {
      newLimit = 12;
    }

    setPage({
      start: newStart,
      limit: newLimit,
    });
  };

  useEffect(() => {
    console.log(page);
    loadAlbums();
  }, [page])

  if (!albums.length && !isLoading && !isLoaded) {
    loadAlbums();
  }

  const albumsMargin = () => {
    if (isScreenSmall) {
      return {};
    }

    return { marginLeft: '0px', marginTop: '90px' };
  };

  const rightControls = () => {
    if (!search) {
      return (
        <React.Fragment>
          <Button style={{ marginTop: '20px' }} block variant="outline-info" onClick={loadMore}>Next</Button>;
          <Button style={{ marginTop: '20px' }} block variant="outline-info" onClick={loadPrevious}>Previous</Button>;
        </React.Fragment>
      )
    }

    return <React.Fragment />;
  }

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
          <Col lg={11} xl={11}>
            <Row>{renderAlbums}</Row>
          </Col>
          <Col lg={1} xl={1}>
              {rightControls()}
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid style={albumsMargin()}>
      <Row>
        <Col lg={12} xl={12}>
          {/* <Alert variant="primary">{alertText}</Alert> */}
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
