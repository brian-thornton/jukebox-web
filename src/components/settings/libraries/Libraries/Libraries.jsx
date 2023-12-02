import { FormattedMessage } from 'react-intl';
import { useContext, useEffect, useState } from 'react';

import Loading from '../../../common/Loading/Loading';
import { SettingsContext } from '../../../layout/SettingsProvider';
import {
  add,
  discover,
  deleteLibrary,
  scan,
} from '../../../../lib/service-clients/librarian-client';

import Button from '../../../Button';
import LibraryAdd from '../LibraryAdd/LibraryAdd';
import NoResults from '../../../common/NoResults/NoResults';
import LibraryInfoAndGlobalControls from '../LibraryInfoAndGlobalControls/LibraryInfoAndGlobalControls';
import LibraryList from '../LibraryList/LibraryList';
import Categories from '../Categories/Categories';
import Discover from '../Discover/Discover';
import LibraryMenuMobile from '../LibraryMenuMobile/LibraryMenuMobile';
import { useLibraries } from '../../../../hooks/use-libraries';

const Libraries = () => {
  const settings = useContext(SettingsContext);
  const [show, setShow] = useState(false);
  const [showOnline, setShowOnline] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentScan, setCurrentScan] = useState();
  const [isCategoryConfigOpen, setIsCategoryConfigOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleShow = () => setShow(true);
  const handleDiscover = () => setShowDiscover(true);
  const { libraries, isLoading, loadLibraries } = useLibraries(settings);

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
      {noPrompts && !isLoading && !libraries.length && !isMenuOpen && (
        <NoResults
          applyMargin={false}
          title={<FormattedMessage id="no_libraries_title" />}
          text={<FormattedMessage id="no_libraries_text" />}
          controls={noResultsButtons}
        />
      )}
      {noPrompts && !isLoading && libraries.length && isMenuOpen && (
        <LibraryMenuMobile onClose={() => setIsMenuOpen(false)} setShowOnline={setShowOnline} showOnline={showOnline} />
      )}
      {noPrompts && !isLoading && libraries.length && !isMenuOpen && (
        <>
          <LibraryInfoAndGlobalControls
            setShowOnline={setShowOnline}
            onScanAll={onScanAll}
            onDeleteAll={onDeleteAll}
            handleDiscover={handleDiscover}
            handleShow={handleShow}
            currentScan={currentScan}
            totalTracks={totalTracks}
            isScanning={isScanning}
            setIsCategoryConfigOpen={setIsCategoryConfigOpen}
            showOnline={showOnline}
            setIsMenuOpen={setIsMenuOpen}
          />
          <LibraryList
            libraries={libraries}
            reloadLibraries={loadLibraries}
            setCurrentScan={setCurrentScan}
            setSelectedLibrary={setSelectedLibrary}
            showOnline={showOnline}
          />
        </>
      )}
      {!showDiscover && !isCategoryConfigOpen && (selectedLibrary || show) && (
        <LibraryAdd
          library={selectedLibrary}
          setSelectedLibrary={setSelectedLibrary}
          setShow={setShow}
          handleHide={() => setShow(false)}
          handleSave={(category, allowCoverArtDownload) => {
            add({ path: document.getElementById('name').value, category, allowCoverArtDownload });
          }}
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
