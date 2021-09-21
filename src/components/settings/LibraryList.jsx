import React, { useContext, useEffect, useState } from 'react';
import {
  Spinner, ListGroup, ListGroupItem, Button, Col, Row, Container,
} from 'react-bootstrap';
import {
  Check,
  CloudDownload,
  Search,
  Trash,
  X,
} from 'react-bootstrap-icons';
import { getStatus, updateStatus } from '../../lib/status-client';
import { SettingsContext } from '../layout/Jukebox';

import {
  add,
  getLibraries,
  discover,
  deleteLibrary,
  scan,
  saveCoverArt,
} from '../../lib/librarian-client';
import Item from '../common/Item';
import LibraryAddModal from './LibraryAddModal';
import LibraryDiscoverModal from './LibraryDiscoverModal';
import NoResults from '../common/NoResults';
import styles from '../styles';

const albumArt = require('album-art');

function LibraryList() {
  const settings = useContext(SettingsContext);
  const [libraries, setLibraries] = useState([]);
  const [show, setShow] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const handleShow = () => setShow(true);
  const handleDiscover = () => setShowDiscover(true);
  const renderLibraries = [];

  const handleClose = (path) => {
    if (path) {
      add({
        path,
      });
    }
    setShow(false);
    loadLibraries();
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
    getLibraries().then((data) => {
      setLibraries(data);
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

  useEffect(() => loadLibraries(), []);

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
        <Item
          text={`${library.path} - Tracks: ${library.totalTracks || 0}`}
          buttons={(
            <>
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
            </>
          )}
        />
      ),
    );
  });

  const addButton = (
    <Button
      variant="outline-light"
      className="float-right"
      onClick={handleShow}
    >
      Add
    </Button>
  );

  const noResultsAddButton = (
    <Button
      variant="outline-light"
      onClick={handleShow}
    >
      Add
    </Button>
  );

  return (
    <>
      <div>
        {!isScanning && renderLibraries.length > 0 && (
          <>
            <div style={{ color: settings.styles.fontColor }}>{`Total Library Tracks: ${totalTracks}`}</div>
            <ListGroup style={{ width: '100%' }}>
              {renderLibraries}
            </ListGroup>
          </>
        )}
      </div>
      {renderLibraries.length === 0 && (
        <NoResults
          title="No Libraries"
          text="No Libraries have been added. Click Add to add your first library."
          controls={noResultsAddButton}
        />
      )}
      <LibraryAddModal isOpen={show} handleHide={() => setShow(false)} handleSave={() => handleClose(document.getElementById('path').value)} />
      <LibraryDiscoverModal isOpen={showDiscover} handleHide={() => setShowDiscover(false)} handleSave={() => handleCloseDiscover(document.getElementById('path').value)} />
    </>
  );
}

export default LibraryList;
