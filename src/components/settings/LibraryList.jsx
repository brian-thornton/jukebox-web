import React, { useState } from 'react';
import {
  ListGroup, ListGroupItem, Button, Col, Row, Container,
} from 'react-bootstrap';
import {
  Check,
  CloudDownload,
  Search,
  Trash,
  X,
} from 'react-bootstrap-icons';
import { getStatus, updateStatus } from '../../lib/status-client';

import {
  add,
  getLibraries,
  discover,
  deleteLibrary,
  scan,
  saveCoverArt,
} from '../../lib/librarian-client';
import LibraryAddModal from './LibraryAddModal';
import LibraryDiscoverModal from './LibraryDiscoverModal';
import styles from '../styles';

const albumArt = require('album-art');

function LibraryList() {
  const [libraries, setLibraries] = useState([]);
  const [show, setShow] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleClose = (path) => {
    if (path) {
      add({
        path,
      });
    }
    setShow(false);
  };

  const updateTotals = (data) => {
    let totalTracks = 0;
    let totalAlbums = 0;
    data.forEach((lib) => {
      totalTracks += lib.totalTracks;
      totalAlbums += lib.albums.length;
    });
    getStatus().then((response) => {
      updateStatus({ ...response, totalTracks, totalAlbums });
    });
  };

  const loadLibraries = () => {
    setIsLoading(true);
    getLibraries().then((data) => {
      setLibraries(data);
      setIsLoading(false);
      setIsLoaded(true);
      updateTotals(data);
    });
  };

  const handleCloseDiscover = (path) => {
    if (path) {
      discover(path).then((libs) => {
        libs.forEach((lib) => {
          if (!libraries.find(l => l.path === lib)) {
            add({ path: lib });
          }
        });
        loadLibraries();
      });
    }
    setShowDiscover(false);
  };

  const handleShow = () => setShow(true);
  const handleDiscover = () => setShowDiscover(true);

  const removeLibrary = (name) => {
    deleteLibrary(name).then(() => {
      getLibraries().then((data) => {
        setLibraries(data);
      });
    });
  };

  const onScan = (library) => {
    setIsScanning(true);
    scan(library).then(() => {
      setIsScanning(false);
      loadLibraries();
    });
  };

  const downloadCoverArt = (library) => {
    let count = 0;
    library.albums.forEach((album) => {
      if (!album.coverArtExists) {
        const nameArray = album.name.split('-');
        setTimeout(() => {
          albumArt(nameArray[0], { album: nameArray[1] }).then((data) => {
            if (data.toString().includes('http')) {
              saveCoverArt({ album, url: data });
            }
          });
        }, 2000 * count);
        count += 1;
      }
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
    const enabled = library.enabled ? <Check /> : <X />;
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
            <Search />
          </Button>
          <Button {...buttonProps} onClick={() => removeLibrary(library.name)}><Trash /></Button>
          <Button {...buttonProps} variant="outline-light" className="float-right" disabled={isScanning} onClick={() => downloadCoverArt(library)}>
            <CloudDownload />
          </Button>
          <Button style={style} variant="outline-light" className="float-right" disabled={isScanning}>{enabled}</Button>
        </ListGroupItem>
      ),
    );
  });

  return (
    <>
      <Container style={{ marginTop: '0px' }}>
        <Row>
          <Col lg={12} xl={12}>
            <div style={styles.totalTracksStyle}>
              Total Library Tracks:
              <div style={styles.totalTracksCount}>{totalTracks}</div>
            </div>
            <Button
              variant="outline-light"
              className="float-right"
              onClick={handleShow}
            >
              Add
            </Button>
            <Button
              style={{ marginRight: '8px' }}
              variant="outline-light"
              className="float-right"
              onClick={handleDiscover}
            >
              Discover
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: '5px' }}>
          <Col lg={12} xl={12}>
            <ListGroup>
              {renderLibraries}
            </ListGroup>
          </Col>
        </Row>
      </Container>
      <LibraryAddModal isOpen={show} handleHide={() => setShow(false)} handleSave={() => handleClose(document.getElementById('path').value)} />
      <LibraryDiscoverModal isOpen={showDiscover} handleHide={() => setShowDiscover(false)} handleSave={() => handleCloseDiscover(document.getElementById('path').value)} />
    </>
  );
}

export default LibraryList;
