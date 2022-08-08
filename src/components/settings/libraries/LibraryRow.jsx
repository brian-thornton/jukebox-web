import React, { useState } from 'react';
import {
  CloudDownload,
  Search,
  Trash,
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import InRowDeleteConfirmation from '../../common/InRowDeleteConfirmation';
import {
  deleteLibrary,
  scan,
  saveCoverArt,
} from '../../../lib/librarian-client';

import Button from '../../Button';
import Item from '../../common/Item';
import { toastProps } from '../../common/toast-helper';

const albumArt = require('album-art');

const LibraryRow = ({ library, reloadLibraries, setCurrentScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [deleteConfirmLibrary, setDeleteConfirmLibrary] = useState();

  const removeLibrary = (name) => {
    deleteLibrary(name).then(reloadLibraries)
  };

  const onScan = (library) => {
    setIsScanning(true);
    setCurrentScan(library.path);
    scan(library).then(() => {
      setIsScanning(false);
      reloadLibraries();
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
}

export default LibraryRow;
