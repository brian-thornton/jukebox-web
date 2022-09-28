import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

import { Album as albumShape } from '../shapes';
import { SettingsContext } from '../layout/SettingsProvider';
import './Album.scss';

const propTypes = {
  album: albumShape.isRequired,
  coverArtOnly: PropTypes.bool,
};

const AlbumTable = ({ albums }) => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);
  const [hoverAlbum, setHoverAlbum] = useState();

  let columnCount = Math.floor((window.innerWidth / 500));
  const columnVolume = Math.floor((window.innerHeight - 200) / 32);

  if (columnCount === 0) {
    columnCount = 1;
  }

  const table = () => {
    let counter = 0;
    let tableRows = [];
    let rowAlbums = [];

    const albumTableData = (album) => {
      return (
        <td
          onMouseEnter={() => setHoverAlbum(album)}
          onMouseLeave={() => setHoverAlbum(null)}
          style={{ background: hoverAlbum === album ? settings.styles.activeButtonColor : '' }}
          onClick={() => {
            navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
          }}>
          {album.name}
        </td>
      );
    }

    if (columnCount === 1 || albums.length <= columnVolume) {
      albums.map((a) => tableRows.push((
        <tr>
          {albumTableData(a)}
        </tr>
      )));
    } else {
      for (let i = 0; i < albums.length; i += 1) {
        rowAlbums.push(albumTableData(albums[i]));

        if (counter < columnCount - 1) {
          counter += 1;
        } else {
          tableRows.push(<tr>
            {rowAlbums}
          </tr>);
          counter = 0;
          rowAlbums = [];
        }
      }
    }
    tableRows.push(<tr>
      {rowAlbums}
    </tr>);
    return tableRows;
  };

  return (
    <Table size="sm" striped bordered variant='dark' style={{ marginBottom: '0' }}>
      <tbody>
        {table()}
      </tbody>
    </Table>
  );
}

AlbumTable.defaultProps = {
  coverArtOnly: false,
};

AlbumTable.propTypes = propTypes;

export default AlbumTable;
