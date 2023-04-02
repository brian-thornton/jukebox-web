import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import React, { useContext, useState } from 'react';
import Table from 'react-bootstrap/Table';

import './AlbumTable.scss';
import { Albums } from '../shapes';
import { SettingsContext } from '../layout/SettingsProvider';
import Item from '../common/Item';

const propTypes = {
  albums: Albums.isRequired,
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
    const tableRows = [];
    let rowAlbums = [];

    const goToAlbum = (album) => {
      navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
    };

    const albumTableData = album => (
      <td
        onMouseEnter={() => setHoverAlbum(album)}
        onMouseLeave={() => setHoverAlbum(null)}
        style={{ background: hoverAlbum === album ? settings.styles.activeButtonColor : '' }}
      >
        <Item text={album.name} onClick={() => goToAlbum(album)} />
      </td>
    );

    if (columnCount === 1 || albums.length <= columnVolume) {
      albums.map(a => tableRows.push((
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
          tableRows.push(<tr>{rowAlbums}</tr>);
          counter = 0;
          rowAlbums = [];
        }
      }
    }
    tableRows.push(<tr>{rowAlbums}</tr>);
    return tableRows;
  };

  return (
    <Table size="sm" striped bordered variant="dark" className="albumTable">
      <tbody>
        {table()}
      </tbody>
    </Table>
  );
};

AlbumTable.propTypes = propTypes;

export default AlbumTable;
