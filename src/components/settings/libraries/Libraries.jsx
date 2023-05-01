import { FormattedMessage } from 'react-intl';
import { useContext, useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';

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
import LibraryAdd from './LibraryAdd';
import NoResults from '../../common/NoResults';
import './Libraries.scss';
import LibraryInfoAndGlobalControls from './LibraryInfoAndGlobalControls';
import LibraryList from './LibraryList';
import Categories from './Categories';
import Discover from './Discover';

const Libraries = () => {
  const [isLoading, setIsLoading] = useState(false);
  const settings = useContext(SettingsContext);
  const [libraries, setLibraries] = useState([]);
  const [show, setShow] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState();
  const [isCategoryConfigOpen, setIsCategoryConfigOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState();
  const handleShow = () => setShow(true);
  const handleDiscover = () => setShowDiscover(true);

  const GET_LIBRARIES = gql`
    query GetLibraries {
      libraries {
        name
      }
    }
`;

  const { loading, error, data } = useQuery(GET_LIBRARIES);
  useEffect(() => console.log(data), data);

  const updateTotals = (data) => {
    let totalTracks = 0;
    let totalAlbums = 0;

    const categoryAlbums = {};
    settings.categories.map(c => categoryAlbums[c] = 0);

    if (data) {
      data.forEach((lib) => {
        if (lib.category && lib.albums?.length) {
          categoryAlbums[lib.category] += lib.albums.length;
        } else {
          if (lib?.albums?.length) {
            totalTracks += lib?.totalTracks;
            totalAlbums += lib?.albums?.length;
          }
        }
      });
      getStatus().then((response) => {
        updateStatus({
          ...response,
          totalTracks,
          totalAlbums,
          categoryAlbums,
        });
      });
    }
  };

  const loadLibraries = () => {
    setIsLoading(true);
    getLibraries().then((data) => {
      setLibraries(data);
      updateTotals(data);
      setIsLoading(false);
    });
  };

  const handleClose = (path, category, allowCoverArtDownload = true) => {
    if (!selectedLibrary && path) {
      add({ path, category, allowCoverArtDownload });
    } else if (selectedLibrary && (path || selectedLibrary)) {
      deleteLibrary(selectedLibrary.name).then(() => {
        add({
          path: path || selectedLibrary.path,
          category, allowCoverArtDownload,
          albums: selectedLibrary?.albums || [],
          tracks: selectedLibrary?.tracks || [],
        });
      });
    }
    setSelectedLibrary(null);
    setShow(false);
    loadLibraries();
  };

  const handleCloseDiscover = (path, category, downloadCoverArt) => {
    if (path) {
      discover(path).then((libs) => {
        libs.forEach((lib) => {
          if (!libraries.find(l => l.path === lib)) {
            add({ path: lib, category, allowCoverArtDownload: downloadCoverArt });
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
  };

  const onDeleteAll = async () => {
    setIsScanning(true);
    for (const library of libraries) {
      await deleteLibrary(library.name);
    }

    setIsScanning(false);
    setCurrentScan(null);
    loadLibraries();
  };

  const noResultsButtons = (
    <>
      <Button onClick={handleShow} content={<FormattedMessage id="add" />} />
      <Button onClick={handleDiscover} content={<FormattedMessage id="discover" />} />
    </>
  );

  const noPrompts = !showDiscover && !(show || selectedLibrary) && !isCategoryConfigOpen;

  return (
    <>
      {noPrompts && isLoading && <Loading />}
      {noPrompts && !isLoading && !libraries.length && (
        <NoResults
          applyMargin={false}
          className="fullWidth"
          title={<FormattedMessage id="no_libraries_title" />}
          text={<FormattedMessage id="no_libraries_text" />}
          controls={noResultsButtons}
        />
      )}
      {noPrompts && !isLoading && libraries.length && (
        <>
          <LibraryInfoAndGlobalControls
            onScanAll={onScanAll}
            onDeleteAll={onDeleteAll}
            handleDiscover={handleDiscover}
            handleShow={handleShow}
            currentScan={currentScan}
            totalTracks={totalTracks}
            isScanning={isScanning}
            setIsCategoryConfigOpen={setIsCategoryConfigOpen}
          />
          <LibraryList
            libraries={libraries}
            reloadLibraries={loadLibraries}
            setCurrentScan={setCurrentScan}
            setSelectedLibrary={setSelectedLibrary}
          />
        </>
      )}
      {!showDiscover && !isCategoryConfigOpen && (selectedLibrary || show) && (
        <LibraryAdd
          library={selectedLibrary}
          setSelectedLibrary={setSelectedLibrary}
          setShow={setShow}
          handleHide={() => setShow(false)}
          handleSave={(category, allowCoverArtDownload) => handleClose(document.getElementById('name').value, category, allowCoverArtDownload)}
        />
      )}
      {!isCategoryConfigOpen && showDiscover && !(show || selectedLibrary) && (
        <Discover
          handleHide={() => setShowDiscover(false)}
          handleSave={(category, downloadCoverArt) => handleCloseDiscover(document.getElementById('name').value, category, downloadCoverArt)}
        />
      )}
      {isCategoryConfigOpen && <Categories onClose={() => setIsCategoryConfigOpen(false)} />}
    </>
  );
};

export default Libraries;
