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

function AlbumList({ search, setCurrentAlbum }) {
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(100);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAlbums = () => {
    setIsLoading(true);
    if (search) {
      LibrianClient.searchAlbums(search).then(data => setAlbums(data));
      setIsLoading(false);
    } else {
      LibrianClient.getAlbums(start, limit).then((data) => {
        if (start === 0) {
          setAlbums(data);
        } else {
          setAlbums(albums.concat(data));
        }
        setStart(limit);
        setLimit(limit + 100);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    setStart(0);
    setLimit(100);
    loadAlbums();
  }, [search]);

  const loadMore = () => {
    setStart(limit);
    setLimit(limit + 100);
    loadAlbums();
  };

  if (!albums.length && !isLoading) {
    loadAlbums();
  }

  if (albums.length) {
    const renderAlbums = [];
    albums.forEach(album => {
      renderAlbums.push(<Album album={album} setCurrentAlbum={setCurrentAlbum} />);
    })

    return (
      <Container fluid style={{ marginLeft: '50px' }}>
        <Row>
          {renderAlbums}
        </Row>
        <Row>
          <Button block variant="outline-info" onClick={loadMore}>Load More</Button>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid style={{ marginLeft: '50px' }}>
      <Row>
        <Col lg={12} xl={12} >
          <Alert variant="primary">Loading albums.  If you don't see any results, set up your library in Settings.</Alert>
        </Col>
      </Row>
    </Container>
  );
}

export default AlbumList;
