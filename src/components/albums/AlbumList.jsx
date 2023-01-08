import { PropTypes } from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React, { useContext, useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';

import './AlbumList.scss';
import { applyLighting } from '../../lib/lightingHelper';
import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import { handlers } from '../../lib/gesture-helper';
import { headerFooterReserve } from '../../lib/styleHelper';
import { Libraries } from '../shapes';
import { SettingsContext } from '../layout/SettingsProvider';
import Album from './Album';
import AlbumTable from './AlbumTable';
import Loading from '../common/Loading';
import NoResults from '../common/NoResults';
import Paginator from '../common/Paginator';
import StartsWithFilter from './StartsWithFilter';
import FullWidthRow from '../common/FullWidthRow';

const propTypes = {
  selectedLibraries: Libraries,
  setStartsWithFilter: PropTypes.func,
  startsWithFilter: PropTypes.string,
};

const AlbumList = ({
  display, search, selectedLibraries, setStartsWithFilter, startsWithFilter,
}) => {
  const settings = useContext(SettingsContext);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState();
  const [lastSearch, setLastSearch] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useState();
  const { state } = useLocation();
  const { startsWithLocation, coverSize } = settings.preferences;
  const { isScreenSmall } = settings;
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const noResults = search && !albums.length && !isLoading;
  const cols = startsWithLocation === 'none' ? '12' : '11';
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
    const start = selectedPage === 1 ? 0 : ((selectedPage * pageSize) - pageSize);
    const end = start + pageSize;
    const { preferences } = settings;

    if (selectedPage && pageSize) {
      setAlbums([]);
      if (search || startsWithFilter) {
        findAlbums(start, (start + pageSize));
      } else {
        const musicCategory = category === 'Albums' ? null : category;

        getAlbums(start, end, musicCategory, selectedLibraries, preferences.restrictionGroup)
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
      setPageSize(itemsPerColumn * 3);
    } else {
      const reserve = headerFooterReserve(settings);
      const startsWithReserve = ['left', 'right'].includes(startsWithLocation) ? 25 : 0;

      let coverWidth = 200;
      let coverHeight = 220;

      if (coverSize === 'medium') {
        coverWidth = 300;
        coverHeight = 400;
      }

      if (coverSize === 'large') {
        coverWidth = 400;
        coverHeight = 400;
      }

      if (settings.isScreenSmall) {
        coverWidth = 200;
        coverHeight = 200;
      }

      const albumsPerRow = Math.floor(window.innerWidth / (coverWidth + startsWithReserve));
      const numberOfRows = Math.floor((window.innerHeight - reserve) / (display === 'grid' ? 65 : coverHeight));
      setPageSize(albumsPerRow * numberOfRows);
    }
  }, [display]);

  useEffect(() => {
    setIsLoading(true);
    loadAlbums();
  }, [category, pageSize, selectedPage, selectedLibraries, search, startsWithFilter]);

  const paginator = (
    <Paginator
      onPageChange={(page) => setSelectedPage(page)}
      selectedPage={selectedPage}
      totalItems={totalAlbums}
      pageSize={pageSize}
      disableRandom={search?.length > 0 || display !== 'covers'}
    />
  );

  const startsWithCol = (
    <Col lg="1" xl="1" md="1" sm="1">
      <StartsWithFilter
        startsWithFilter={startsWithFilter}
        setStartsWithFilter={setStartsWithFilter}
      />
    </Col>
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
              { startsWithCol }
            )}
            <Col lg={cols} xl={cols} md={cols} sm={cols} className="centerCol">
              {display !== 'grid' && (
                <Container fluid>
                  <Row className="albumRow">
                    {albums.map(album => <Album album={album} />)}
                  </Row>
                  <Row className="albumRow">
                    {(totalAlbums > pageSize) && startsWithLocation !== 'none' && !search && paginator}
                  </Row>
                </Container>
              )}
              {display === 'grid' && <AlbumTable albums={albums} />}
            </Col>
            {startsWithLocation === 'right' && !isScreenSmall && !search && (
              { startsWithCol }
            )}
          </Row>
          {(startsWithLocation === 'none' || search) && (
            <FullWidthRow>
              {(totalAlbums > pageSize) && paginator}
            </FullWidthRow>
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
