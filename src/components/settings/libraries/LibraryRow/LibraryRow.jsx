import { PropTypes } from 'prop-types';
import { useContext, useState } from 'react';
import {
  PencilSquare,
  Search,
  Trash,
} from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';

import InRowDeleteConfirmation from '../../../common/InRowDeleteConfirmation/InRowDeleteConfirmation';
import {
  deleteLibrary,
  scan,
} from '../../../../lib/service-clients/librarian-client';

import Button from '../../../common/Button/Button';
import Item from '../../../common/Item/Item';
import { Library } from '../../../shapes';
import { SettingsContext } from '../../../layout/SettingsProvider';

const propTypes = {
  library: Library.isRequired,
  reloadLibraries: PropTypes.func.isRequired,
  setCurrentScan: PropTypes.func.isRequired,
  setSelectedLibrary: PropTypes.func.isRequired,
};

const LibraryRow = ({
  library,
  reloadLibraries,
  setCurrentScan,
  setSelectedLibrary,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [deleteConfirmLibrary, setDeleteConfirmLibrary] = useState();
  const settings = useContext(SettingsContext);
  const { screen } = settings;

  const removeLibrary = (name) => {
    deleteLibrary(name).then(reloadLibraries);
  };

  const onScan = (libraryToScan) => {
    setIsScanning(true);
    setCurrentScan(libraryToScan.path);
    scan(libraryToScan).then(() => {
      setIsScanning(false);
      reloadLibraries();
      setCurrentScan(null);
    });
  };

  const status = <FormattedMessage id={library.enabled ? 'online' : 'offline'} />;
  const text = () => {
    if (screen.isMobile) {
      return `...${library.path.slice(-27)}`;
    } else {
      return (
        <FormattedMessage
          id="library_info"
          values={{
            path: library.path,
            totalTracks: library.totalTracks,
            status,
          }}
        />
      );
    }
  }

  return (
    <Item
      actionVisible={deleteConfirmLibrary}
      text={text()}
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
                onClick={() => {
                  onScan({
                    name: library.name,
                    path: library.path,
                    enabled: library.enabled,
                    category: library.category,
                    allowCoverArtDownload: library.allowCoverArtDownload,
                  });
                }}
                content={<Search />}
              />
              <Button
                disabled={isScanning}
                onClick={() => setDeleteConfirmLibrary(library)}
                content={<Trash />}
              />
              <Button
                disabled={isScanning}
                onClick={() => setSelectedLibrary(library)}
                content={<PencilSquare />}
              />
            </>
          )}
        </>
      )}
    />
  );
};

LibraryRow.propTypes = propTypes;

export default LibraryRow;
