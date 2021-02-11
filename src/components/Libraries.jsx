import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Alert,
  Button,
  Card,
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import Album from './Album';
import { Settings } from './shapes';
import defaultCover from '../default_album.jpg';

import styles from './styles';

const propTypes = {
  settings: Settings.isRequired,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function Libraries({ settings, setCurrentAlbum }) {
  const [libraries, setLibraries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [alertText, setAlertText] = useState('Loading libraries...');
  const [currentLibrary, setCurrentLibrary] = useState();

  const loadLibraries = () => {
    setIsLoading(true);
    LibrianClient.getLibraries().then((data) => {
      if (!data.length) {
        setAlertText('No libraries found.  Set up your libraries in Settings.');
      }
      setLibraries(data);
      setIsLoading(false);
      setIsLoaded(true);
    });
  };

  if (!libraries.length && !isLoading && !isLoaded) {
    loadLibraries();
  }

  const backButton = () => {
    if (currentLibrary) {
      return (
        <Button style={styles.buttonStyle} onClick={() => setCurrentLibrary(null)}>
          Back to Libraries
        </Button>
      );
    }

    return <React.Fragment />;
  };

  if (libraries.length && !currentLibrary) {
    const renderLibraries = [];
    libraries.forEach((library) => {
      renderLibraries.push(
        <Card style={styles.albumCardStyle} className="h-55 w-85" onClick={() => setCurrentLibrary(library)}>
          <Card.Img style={styles.albumImage} top src={defaultCover} />
          <Card.Body style={{ padding: '0px' }}>
            <Card.Title style={styles.albumTitle}>{library.name}</Card.Title>
          </Card.Body>
        </Card>,
      );
    });

    return (
      <Container fluid style={{ marginTop: '60px', paddingBottom: '60px', marginLeft: '50px' }}>
        <Row>{renderLibraries}</Row>
      </Container>
    );
  }

  if (currentLibrary) {
    const renderAlbums = [];
    currentLibrary.albums.forEach((album) => {
      renderAlbums.push(
        <Album
          album={album}
          setCurrentAlbum={setCurrentAlbum}
          settings={settings}
        />,
      );
    });

    return (
      <Container fluid style={{ marginLeft: '50px' }}>
        <Row>{backButton()}</Row>
        <Row>{renderAlbums}</Row>
      </Container>
    );
  }

  return (
    <Container fluid style={{ marginLeft: '50px' }}>
      <Row>
        <Col lg={12} xl={12}>
          <Alert variant="primary">{alertText}</Alert>
        </Col>
      </Row>
    </Container>
  );
}

Libraries.propTypes = propTypes;

export default Libraries;
