import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext, useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import { applyLighting } from '../../lib/lightingHelper';
import Album from './Album';
import AlbumTable from './AlbumTable';
import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import Loading from '../common/Loading';
import NoResults from '../common/NoResults';
import Paginator from '../common/Paginator';
import { SettingsContext } from '../layout/SettingsProvider';
import './AlbumList.scss';
import { handlers } from '../../lib/gesture-helper';

const propTypes = {
  search: PropTypes.string,
};

const AlbumList = ({ search, selectedLibraries, display}) => {
  const settings = useContext(SettingsContext);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lightingApplied, setLightingApplied] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState();
  const [lastSearch, setLastSearch] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const { state } = useLocation();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  let category = state?.category;

  const onPageChange = (page) => {
    setSelectedPage(page);
  }

  const { pathname } = window.location;
  if (!category && pathname.includes('/categories')) {
    category = pathname.slice(window.location.pathname.lastIndexOf("/") + 1, pathname.length);
  }

  useEffect(() => {
    const albumsPerRow = Math.floor(window.innerWidth / 225);
    const numberOfRows = Math.floor((window.innerHeight - 200) / (display === 'grid' ? 65 : 200));
    setRealPageSize(albumsPerRow * numberOfRows);
    applyLighting(settings, 'Albums');
  }, []);

  const findAlbums = async (start, limit) => {
    searchAlbums(search, start, limit).then((data) => {
      if (data.albums.length) {
        setTotalAlbums(data.totalAlbums);
        setAlbums(data.albums);
        if (search !== lastSearch) {
          setLastSearch(search);
        }
      }
      window.scrollTo(0, 0);
      setIsLoading(false);
    }).catch((e) => {
      console.log(e);
    });
  };

  const loadAlbums = async () => {
    // 1: 0
    // 2: 2 * 12 == 24 - 12 = 12
    // 3: 3 * 12 == 36 - 12 = 24
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

    if (selectedPage && realPageSize) {
      setAlbums([]);
      if (search) {
        findAlbums(realStart, (realStart + realPageSize));
      } else {
        const musicCategory = category === 'Albums' ? null : category;

        getAlbums(realStart, (realStart + realPageSize), musicCategory, selectedLibraries).then((data) => {
          setTotalAlbums(data.totalAlbums);
          setAlbums(data.albums);
          window.scrollTo(0, 0);
          setIsLoading(false);
          setLoadComplete(true);
        });
      }
    }
  };

  useEffect(() => {
    if (display !== 'covers') {
      const itemsPerColumn = Math.floor((window.innerHeight - 200) / 33);
      setRealPageSize(itemsPerColumn * 3);
    } else {
      const albumsPerRow = Math.floor(window.innerWidth / 225);
      const numberOfRows = Math.floor((window.innerHeight - 200) / (display === 'grid' ? 65 : 200));
      setRealPageSize(albumsPerRow * numberOfRows);
    }
  }, [display]);

  useEffect(() => {
    setIsLoading(true);
    loadAlbums();
  }, [category, realPageSize, selectedPage, selectedLibraries]);

  useEffect(() => {
    setIsLoading(true);
    if (!search) {
      if (albums.length) {
        window.location.reload();
      }
    }

    loadAlbums();
  }, [search]);

  const noResults = search && !albums.length && !isLoading;

  const albumTable = (
    <Table striped bordered hover variant="dark">
      <tbody>
        {albums.map(album => <tr>{album.name}</tr>)}
      </tbody>
    </Table>
  );

  return (
    <>
      {loadComplete && totalAlbums === 0 && <NoResults title="No Albums Loaded" text="No Albums Found. Configure your library in Settings." />}
      {noResults && <NoResults title="No Results Found" text="No Albums found matching your search. Please try again." />}
      {isLoading && <Loading />}
      {!isLoading && !noResults && (
        <Container {...swipe} fluid className="albumListContainer">
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              {display !== 'grid' && (
                <Row className="albumRow">
                  {albums.map(album => <Album album={album} />)}
                </Row>
              )}
              {display === 'grid' && <AlbumTable albums={albums} />}
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              {(totalAlbums > realPageSize) && (
                <Paginator
                  onPageChange={onPageChange}
                  selectedPage={selectedPage}
                  totalItems={totalAlbums}
                  pageSize={realPageSize}
                />
              )}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

AlbumList.propTypes = propTypes;

AlbumList.defaultProps = {
  search: '',
};

export default AlbumList;
