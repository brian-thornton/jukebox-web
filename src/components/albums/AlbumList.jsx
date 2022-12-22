import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext, useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import { applyLighting } from '../../lib/lightingHelper';
import Album from './Album';
import AlbumTable from './AlbumTable';
import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import Loading from '../common/Loading';
import NoResults from '../common/NoResults';
import Paginator from '../common/Paginator';
import StartsWithFilter from './StartsWithFilter';
import { SettingsContext } from '../layout/SettingsProvider';
import './AlbumList.scss';
import { handlers } from '../../lib/gesture-helper';
import { headerFooterReserve } from '../../lib/styleHelper';
import { Libraries } from '../shapes';

const propTypes = {
  search: PropTypes.string,
  selectedLibraries: Libraries,
  display: PropTypes.string.isRequired,
  startsWithFilter: PropTypes.string,
  setStartsWithFilter: PropTypes.func,
};

const AlbumList = ({
  search,
  selectedLibraries,
  display,
  startsWithFilter,
  setStartsWithFilter,
}) => {
  const settings = useContext(SettingsContext);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState();
  const [lastSearch, setLastSearch] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const { state } = useLocation();
  const { startsWithLocation, coverSize } = settings.preferences;
  const isScreenSmall = window.innerWidth < 700;
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  let category = state?.category;

  const { pathname } = window.location;
  if (!category && pathname.includes('/categories')) {
    category = pathname.slice(window.location.pathname.lastIndexOf('/') + 1, pathname.length);
  }

  useEffect(() => {
    applyLighting(settings, 'Albums');
  }, []);

  const findAlbums = async (start, limit) => {
    searchAlbums(search, start, limit, startsWithFilter).then((data) => {
      if (data.albums.length) {
        setTotalAlbums(data.totalAlbums);
        setAlbums(data.albums);
        if (search !== lastSearch) {
          setLastSearch(search);
        }
      }
      window.scrollTo(0, 0);
      setIsLoading(false);
    }).catch(() => {
      // Something went wrong. Let's try that again.
      setTimeout(() => findAlbums(start, limit), 3000);
    });
  };

  const loadAlbums = async () => {
    // 1: 0
    // 2: 2 * 12 == 24 - 12 = 12
    // 3: 3 * 12 == 36 - 12 = 24
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
    const end = realStart + realPageSize;
    const { preferences } = settings;

    if (selectedPage && realPageSize) {
      setAlbums([]);
      if (search || startsWithFilter) {
        findAlbums(realStart, (realStart + realPageSize));
      } else {
        const musicCategory = category === 'Albums' ? null : category;

        getAlbums(realStart, end, musicCategory, selectedLibraries, preferences.restrictionGroup)
          .then((data) => {
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
      const itemsPerColumn = Math.floor((window.innerHeight - 200) / 40);
      setRealPageSize(itemsPerColumn * 3);
    } else {
      const reserve = headerFooterReserve(settings);
      const startsWithReserve = ['left', 'right'].includes(startsWithLocation) ? 25 : 0;

      let coverWidth = 225;
      let coverHeight = 200;
      if (coverSize === 'small') {
        coverWidth = 200;
        coverHeight = 200;
      }

      if (coverSize === 'medium') {
        coverWidth = 300;
        coverWidth = 400;
      }

      if (coverSize === 'large') {
        coverWidth = 400;
        coverHeight = 400;
      }

      const albumsPerRow = Math.floor(window.innerWidth / (coverWidth + startsWithReserve));
      const numberOfRows = Math.floor((window.innerHeight - reserve) / (display === 'grid' ? 65 : coverHeight));
      setRealPageSize(albumsPerRow * numberOfRows);
    }
  }, [display]);

  useEffect(() => {
    setIsLoading(true);
    loadAlbums();
  }, [category, realPageSize, selectedPage, selectedLibraries]);

  useEffect(() => {
    if (!search && !startsWithFilter) {
      if (albums.length) {
        window.location.reload();
      }
    }

    if (selectedPage === 1) {
      loadAlbums();
    } else {
      setSelectedPage(1);
    }
  }, [search, startsWithFilter]);

  const noResults = search && !albums.length && !isLoading;
  const cols = startsWithLocation === 'none' ? '12' : '11';

  const paginator = (
    <Paginator
      onPageChange={(page) => setSelectedPage(page)}
      selectedPage={selectedPage}
      totalItems={totalAlbums}
      pageSize={realPageSize}
      disableRandom={search?.length > 0}
    />
  );

  return (
    <>
      {loadComplete && totalAlbums === 0 && <NoResults title="No Albums Loaded" text="No Albums Found. Configure your library in Settings." />}
      {noResults && <NoResults title="No Results Found" text="No Albums found matching your search. Please try again." marginTop="60px" />}
      {isLoading && <Loading />}
      {!isLoading && !noResults && (
        <Container {...swipe} fluid className="albumListContainer">
          <Row className="containerRow">
            {startsWithLocation === 'left' && !isScreenSmall && !search && (
              <Col lg="1" xl="1" md="1" sm="1">
                <StartsWithFilter
                  startsWithFilter={startsWithFilter}
                  setStartsWithFilter={setStartsWithFilter}
                />
              </Col>
            )}
            <Col lg={cols} xl={cols} md={cols} sm={cols} className="centerCol">
              {display !== 'grid' && (
                <Container fluid>
                  <Row className="albumRow">
                    {albums.map(album => <Album album={album} />)}
                  </Row>
                  <Row className="albumRow">
                    {(totalAlbums > realPageSize) && startsWithLocation !== 'none' && !search && paginator}
                  </Row>
                </Container>
              )}
              {display === 'grid' && <AlbumTable albums={albums} />}
            </Col>
            {startsWithLocation === 'right' && !isScreenSmall && !search && (
              <Col lg="1" xl="1" md="1" sm="1">
                <StartsWithFilter
                  startsWithFilter={startsWithFilter}
                  setStartsWithFilter={setStartsWithFilter}
                />
              </Col>
            )}
          </Row>
          {(startsWithLocation === 'none' || search) && (
            <Row>
              <Col lg="12" xl="12" md="12" sm="12">
                {(totalAlbums > realPageSize) && paginator}
              </Col>
            </Row>
          )}
        </Container>
      )}
    </>
  );
};

AlbumList.propTypes = propTypes;

AlbumList.defaultProps = {
  search: '',
  selectedLibraries: null,
  startsWithFilter: null,
  setStartsWithFilter: null,
};

export default AlbumList;
