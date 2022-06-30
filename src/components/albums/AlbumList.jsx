import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';

import Album from './Album';
import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import Loading from '../common/Loading';
import NoResults from '../common/NoResults';
import Paginator from '../common/Paginator';
import styles from './AlbumList.module.css';

const propTypes = {
  search: PropTypes.string,
};

const AlbumList = ({ search, selectedLibraries }) => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState();
  const [lastSearch, setLastSearch] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const { state } = useLocation();
  let category = state?.category;

  const { pathname } = window.location;
  if (!category && pathname.includes('/categories')) {
    category = pathname.slice(window.location.pathname.lastIndexOf("/") + 1 , pathname.length);
  }

  useEffect(() => {
    const albumsPerRow = Math.floor(window.innerWidth / 225);
    const numberOfRows = Math.floor((window.innerHeight - 200) / 200);
    setRealPageSize(albumsPerRow * numberOfRows);
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

  const loadAlbums = () => {
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

  const onPageChange = (page) => {
    setSelectedPage(page);
  }

  const noResults = search && !albums.length && !isLoading;

  return (
    <>
      {loadComplete && totalAlbums === 0 && (
        <div className={styles.noAlbums}>
          <NoResults title="No Albums Loaded" text="No Albums Found. Configure your library in Settings." />
        </div>
      )}
      {noResults && (
        <div className={styles.noAlbums}>
          <NoResults title="No Results Found" text="No Albums found matching your search. Please try again." />
        </div>
      )}
      {isLoading && <Loading />}
      {!isLoading && !noResults && (
        <Container fluid className={styles.albumListContainer}>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row className={styles.albumRow}>
                {albums.map(album => <Album album={album} />)}
              </Row>
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
