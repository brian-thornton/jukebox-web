import React, { useContext, useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import {
  CloudDownload,
  Search,
  Trash,
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import { getStatus, updateStatus } from '../../lib/status-client';
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

import {
  getHeight,
  initHorizontalPaging,
  initListPaging,
  nextPage,
  previousPage,
} from '../../lib/pageHelper';

import Button from '../Button';
import Item from '../common/Item';
import LibraryAddModal from './LibraryAddModal';
import LibraryDiscoverModal from './LibraryDiscoverModal';
import NoResults from '../common/NoResults';
import PagedContainer from '../common/PagedContainer';
import { toastProps } from '../common/toast-helper';

const albumArt = require('album-art');

function LibraryList() {
  const settings = useContext(SettingsContext);
  const [libraries, setLibraries] = useState([]);
  const [show, setShow] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState();
  const handleShow = () => setShow(true);
  const handleDiscover = () => setShowDiscover(true);
  const renderLibraries = [];
  const [paging, setPaging] = useState();
  const addButton = <Button disabled={isScanning} onClick={handleShow} content="Add" />;
  const initialHeight = getHeight();

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
    getLibraries().then((data) => {
      setPaging(initListPaging(data.length, 90, initialHeight));
      setLibraries(data);
      updateTotals(data);
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

  useEffect(loadLibraries, []);

  let totalTracks = 0;
  libraries.forEach((library) => {
    if (library.totalTracks) {
      totalTracks += library.totalTracks;
    }
  });

  if (paging) {
    libraries.slice(paging.currentPage.start, paging.currentPage.limit).forEach((library) => {
      const status = library.enabled ? 'Online' : 'Offline';

      renderLibraries.push(
        (
          <Item
            text={`${library.path} - Tracks: ${library.totalTracks || 0} [Status: ${status}]`}
            buttons={(
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
                  onClick={() => removeLibrary(library.name)}
                  content={<Trash />}
                />
                <Button
                  disabled={isScanning}
                  onClick={() => downloadCoverArt(library)}
                  content={<CloudDownload />}
                />
              </>
            )}
          />
        ),
      );
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

  const scanAllButton = (
    <Button disabled={isScanning} onClick={onScanAll} content="Scan All" />
  );

  const noResultsButtons = (
    <>
      <Button onClick={handleShow} content="Add" />
      {discoverButton}
    </>
  );

  const content = (
    <>
      <div style={{ width: '100%' }}>
        {renderLibraries.length > 0 && (
          <>
            <div style={{ color: settings.styles.fontColor }}>
              {!currentScan && <div>{`Total Library Tracks: ${totalTracks}`}</div>}
              {currentScan && <div style={{ float: 'left' }}>{`Currently Scanning: ${currentScan}`}</div>}
              <div style={{ float: 'right' }}>{addButton}</div>
              <div style={{ float: 'right' }}>{discoverButton}</div>
              <div style={{ float: 'right' }}>{scanAllButton}</div>
            </div>
            <ListGroup style={{ width: '100%' }}>
              {renderLibraries}
            </ListGroup>
          </>
        )}
      </div>
      {renderLibraries.length === 0 && (
        <NoResults
          style={{ width: '100%' }}
          title="No Libraries"
          text="No Libraries have been added. Click Add to add your first library."
          controls={noResultsButtons}
        />
      )}
      <LibraryAddModal isOpen={show} handleHide={() => setShow(false)} handleSave={(category) => handleClose(document.getElementById('name').value, category)} />
      <LibraryDiscoverModal isOpen={showDiscover} handleHide={() => setShowDiscover(false)} handleSave={() => handleCloseDiscover(document.getElementById('name').value)} />
    </>
  );

  if (paging) {
    return (
      <PagedContainer
        paging={paging}
        content={content}
        clientNextPage={() => setPaging(nextPage(paging))}
        clientPreviousPage={() => setPaging(previousPage(paging))}
      />
    );
  }

  return <></>;
}

export default LibraryList;
