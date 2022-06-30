import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useContext, useEffect, useState } from 'react';
import {
  CloudDownload,
  Search,
  Trash,
} from 'react-bootstrap-icons';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';

import { getStatus, updateStatus } from '../../lib/status-client';
import InRowDeleteConfirmation from '../common/InRowDeleteConfirmation';
import Loading from '../common/Loading';
import Paginator from '../common/Paginator';
import { updateSettings } from '../../lib/settings-client';
import { SettingsContext } from '../layout/SettingsProvider';
import {
  add,
  getLibraries,
  discover,
  deleteLibrary,
  scan,
  saveCoverArt,
} from '../../lib/librarian-client';

import Button from '../Button';
import Item from '../common/Item';
import LibraryAddModal from './LibraryAddModal';
import LibraryDiscoverModal from './LibraryDiscoverModal';
import NoResults from '../common/NoResults';
import { toastProps } from '../common/toast-helper';
import styles from './LibraryList.module.css';

const albumArt = require('album-art');

const LibraryList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const settings = useContext(SettingsContext);
  const [libraries, setLibraries] = useState([]);
  const [show, setShow] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [deleteConfirmLibrary, setDeleteConfirmLibrary] = useState();
  const handleShow = () => setShow(true);
  const handleDiscover = () => setShowDiscover(true);
  const [realPageSize, setRealPageSize] = useState();
  const addButton = <Button disabled={isScanning} onClick={handleShow} content="Add" />;

  const updateTotals = (data) => {
    let totalTracks = 0;
    let totalAlbums = 0;

    const categoryAlbums = {};
    settings.categories.map((c) => {
      categoryAlbums[c] = 0;
    });

    data.forEach((lib) => {
      if (lib.category) {
        categoryAlbums[lib.category] += lib.albums.length;
      } else {
        totalTracks += lib.totalTracks;
        totalAlbums += lib.albums.length;
      }
    });
    getStatus().then((response) => {
      updateStatus({ ...response, totalTracks, totalAlbums, categoryAlbums });
    });
  };

  const loadLibraries = () => {
    setIsLoading(true);
    getLibraries().then((data) => {
      setLibraries(data);
      updateTotals(data);
      setIsLoading(false);
    });
  };

  const handleClose = (path, category) => {
    if (path) {
      add({ path, category });
    }
    setShow(false);
    loadLibraries();
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

        const actualCategories = [...new Set(data.map((lib) => lib.category))];
        if (!actualCategories.includes('Albums')) {
          actualCategories.splice(0, 0, 'Albums');
        }

        const deepClone = JSON.parse(JSON.stringify(settings));
        deepClone.categories = actualCategories.filter(Boolean);
        updateSettings(deepClone).then(() => {
          toast.success("Library successfully deleted!", toastProps);
        });
      });
    });
  };

  const onScan = (library) => {
    setIsScanning(true);
    setCurrentScan(library.path);
    scan(library).then(() => {
      setIsScanning(false);
      loadLibraries();
      setCurrentScan(null);
      toast.success("Scan complete!", toastProps);
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

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
    loadLibraries();
  }, []);

  let totalTracks = 0;
  if (libraries?.length) {
    libraries.forEach((library) => {
      if (library.totalTracks) {
        totalTracks += library.totalTracks;
      }
    });
  }

  const discoverButton = (
    <Button disabled={isScanning} onClick={handleDiscover} content="Discover" />
  );

  const onScanAll = async () => {
    setIsScanning(true);
    for (const library of libraries) {
      setCurrentScan(library.path);
      await scan(library);
    }

    setIsScanning(false);
    setCurrentScan(null);
    loadLibraries();
  }

  const onDeleteAll = async () => {
    setIsScanning(true);
    for (const library of libraries) {
      setCurrentScan(library.path);
      await deleteLibrary(library.name);
    }

    setIsScanning(false);
    setCurrentScan(null);
    loadLibraries();
  }

  const scanAllButton = (
    <Button disabled={isScanning} onClick={onScanAll} content="Scan All" />
  );

  const deleteAllButton = (
    <Button disabled={isScanning} onClick={onDeleteAll} content="Delete All" />
  );

  const noResultsButtons = (
    <>
      <Button onClick={handleShow} content="Add" />
      {discoverButton}
    </>
  );

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && !libraries.length && (
        <NoResults
          className={styles.fullWidth}
          title="No Libraries"
          text="No Libraries have been added. Click Add to add your first library."
          controls={noResultsButtons}
        />
      )}
      {!isLoading && libraries.length && (
        <Container fluid style={{ width: '100%' }}>
          <Row>
            <Col lg={12}>
              <Container fluid>
                <Row>
                  <Col>
                    <div style={{ color: settings.styles.fontColor, marginTop: '20px' }}>
                      {!currentScan && <div>{`Total Library Tracks: ${totalTracks}`}</div>}
                      {currentScan && <div className={styles.scanText}>{`Currently Scanning: ${currentScan}`}</div>}
                    </div>
                  </Col>
                  <Col>
                    <div className={styles.libraryButton}>{addButton}</div>
                    <div className={styles.libraryButton}>{discoverButton}</div>
                    <div className={styles.libraryButton}>{deleteAllButton}</div>
                    <div className={styles.libraryButton}>{scanAllButton}</div>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <ListGroup>
                {libraries.slice(realStart, (realStart + realPageSize)).map((library) => {
                  const status = library.enabled ? 'Online' : 'Offline';

                  return (
                    <Item
                      text={`${library.path} - Tracks: ${library.totalTracks || 0} [Status: ${status}]`}
                      buttons={(
                        <>
                          {deleteConfirmLibrary?.path === library.path && (
                            <InRowDeleteConfirmation
                              onCancel={() => setDeleteConfirmLibrary(null)}
                              onConfirm={() => removeLibrary(library.name)}
                            />
                          )}
                          {deleteConfirmLibrary?.path !== library.path && (
                            <>
                              <Button
                                disabled={isScanning}
                                onClick={() => onScan({
                                  name: library.name,
                                  path: library.path,
                                  enabled: library.enabled,
                                  category: library.category,
                                })}
                                content={<Search />}
                              />
                              <Button
                                disabled={isScanning}
                                onClick={() => setDeleteConfirmLibrary(library)}
                                content={<Trash />}
                              />
                              <Button
                                disabled={isScanning}
                                onClick={() => downloadCoverArt(library)}
                                content={<CloudDownload />}
                              />
                            </>
                          )}
                        </>
                      )}
                    />
                  )
                })}
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Paginator
                disableRandom
                onPageChange={(page) => setSelectedPage(page)}
                selectedPage={selectedPage}
                totalItems={libraries.length}
                pageSize={realPageSize}
              />
            </Col>
          </Row>
        </Container>
      )
      }
      <LibraryAddModal isOpen={show} handleHide={() => setShow(false)} handleSave={(category) => handleClose(document.getElementById('name').value, category)} />
      <LibraryDiscoverModal isOpen={showDiscover} handleHide={() => setShowDiscover(false)} handleSave={() => handleCloseDiscover(document.getElementById('name').value)} />
    </>
  );
}

export default LibraryList;
