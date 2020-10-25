import React, { useState } from 'react';
import {
  ListGroup, ListGroupItem, Button, Col, Row, Container, Modal, InputGroup, FormControl,
} from 'react-bootstrap';
import LibrarianClient from '../lib/librarian-client';
import styles from './styles';

function LibraryList() {
  const [libraries, setLibraries] = useState([]);
  const [show, setShow] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleClose = (path) => {
    if (path) {
      LibrarianClient.add({
        path,
      });
    }
    setShow(false);
  };

  const loadLibraries = () => {
    setIsLoading(true);
    LibrarianClient.getLibraries().then((data) => {
      setLibraries(data);
      setIsLoading(false);
      setIsLoaded(true);
    });
  };

  const handleCloseDiscover = (path) => {
    if (path) {
      LibrarianClient.discover(path).then((libs) => {
        libs.forEach(lib => LibrarianClient.add({ path: lib }));
        loadLibraries();
      });
    }
    setShowDiscover(false);
  };

  const handleShow = () => setShow(true);
  const handleDiscover = () => setShowDiscover(true);

  const deleteLibrary = (name) => {
    LibrarianClient.delete(name).then(() => {
      LibrarianClient.getLibraries().then((data) => {
        setLibraries(data);
      });
    });
  };

  const onScan = (library) => {
    setIsScanning(true);
    LibrarianClient.scan(library).then(() => {
      setIsScanning(false);
      loadLibraries();
    });
  };

  if (!isLoaded && !isLoading && !libraries.length) {
    loadLibraries();
  }

  const renderLibraries = [];

  const buttonProps = {
    style: styles.buttonStyle,
    variant: 'outline-light',
    className: 'float-right',
  };

  if (isScanning) {
    buttonProps.disabled = true;
  }

  let totalTracks = 0;
  libraries.forEach((library) => {
    delete library.tracks;
    const enabled = library.enabled ? 'Enabled' : 'Disabled';
    const style = library.enabled ? styles.enabledStyle : styles.disabledStyle;
    if (library.totalTracks) {
      totalTracks += library.totalTracks;
    }

    renderLibraries.push(
      (
        <ListGroupItem style={styles.cardStyle} key={library.path}>
          {`${library.path} - Tracks: ${library.totalTracks || 0}`}
          <Button
            {...buttonProps}
            onClick={() => onScan({
              name: library.name,
              path: library.path,
              enabled: library.enabled,
            })}
          >
            Scan
          </Button>
          <Button {...buttonProps} onClick={() => deleteLibrary(library.name)}>
            Delete
          </Button>
          <Button style={style} variant="outline-light" className="float-right" disabled={isScanning}>
            {enabled}
          </Button>
        </ListGroupItem>
      ),
    );
  });

  return (
    <>
      <Container>
        <Row>
          <Col lg={12} xl={12}>
            <div style={styles.totalTracksStyle}>
              Total Library Tracks:
              <div style={styles.totalTracksCount}>{totalTracks}</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12} xl={12}>
            <ListGroup>
              {renderLibraries}
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={12} xl={12}>
            <Button
              variant="outline-light"
              className="float-right"
              onClick={handleShow}
            >
              Add
            </Button>
            <Button
              variant="outline-light"
              className="float-right"
              onClick={handleDiscover}
            >
              Discover
            </Button>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Library</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              id="path"
              placeholder="Path"
              aria-label="Path"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleClose(document.getElementById('path').value)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDiscover} onHide={() => setShowDiscover(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Discover</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              id="path"
              placeholder="Path"
              aria-label="Path"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDiscover(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleCloseDiscover(document.getElementById('path').value)}>
            Discover
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default LibraryList;
