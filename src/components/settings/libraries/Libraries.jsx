import React, { useContext, useEffect, useState } from 'react';

import { getStatus, updateStatus } from '../../../lib/status-client';
import Loading from '../../common/Loading';
import { SettingsContext } from '../../layout/SettingsProvider';
import {
  add,
  getLibraries,
  discover,
  deleteLibrary,
  scan,
} from '../../../lib/librarian-client';

import Button from '../../Button';
import LibraryAddModal from './LibraryAddModal';
import LibraryDiscoverModal from './LibraryDiscoverModal';
import NoResults from '../../common/NoResults';
import styles from './Libraries.module.css';
import LibraryInfoAndGlobalControls from './LibraryInfoAndGlobalControls';
import LibraryList from './LibraryList';

const Libraries = () => {
  const [isLoading, setIsLoading] = useState(false);
  const settings = useContext(SettingsContext);
  const [libraries, setLibraries] = useState([]);
  const [show, setShow] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState();
  const handleShow = () => setShow(true);
  const handleDiscover = () => setShowDiscover(true);

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

  useEffect(loadLibraries, []);

  let totalTracks = 0;
  if (libraries?.length) {
    libraries.forEach((library) => {
      if (library.totalTracks) {
        totalTracks += library.totalTracks;
      }
    });
  }

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

  const noResultsButtons = <Button onClick={handleShow} content="Add" />;

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
        <>
          <LibraryInfoAndGlobalControls
            onScanAll={onScanAll}
            onDeleteAll={onDeleteAll}
            handleDiscover={handleDiscover}
            handleShow={handleShow}
            currentScan={currentScan}
            totalTracks={totalTracks}
            isScanning={isScanning}
          />
          <LibraryList libraries={libraries} reloadLibraries={loadLibraries} setCurrentScan={setCurrentScan} />
        </>
      )}
      <LibraryAddModal isOpen={show} handleHide={() => setShow(false)} handleSave={(category) => handleClose(document.getElementById('name').value, category)} />
      <LibraryDiscoverModal isOpen={showDiscover} handleHide={() => setShowDiscover(false)} handleSave={() => handleCloseDiscover(document.getElementById('name').value)} />
    </>
  );
}

export default Libraries;
