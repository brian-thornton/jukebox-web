import { useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext, useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';

import './AlbumList.scss';
import { applyLighting } from '../../lib/lightingHelper';
import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import { handlers } from '../../lib/gesture-helper';
import { SettingsContext } from '../layout/SettingsProvider';
import Album from './Album';
import AlbumTable from './AlbumTable';
import FullWidthRow from '../common/FullWidthRow';
import Loading from '../common/Loading';
import Paginator from '../common/Paginator';
import StartsWithFilter from './StartsWithFilter';
import NoAlbumsLoaded from './NoAlbumsLoaded';
import NoAlbumSearchResults from './NoAlbumsSearchResults';
import { usePageSize } from './album-hooks';
import VerticalAlbumList from './VerticalAlbumList';

interface IAlbumList {
  selectedLibraries?: Array<string>,
  setStartsWithFilter?: Function,
  startsWithFilter?: string,
  display: string,
  search: string,
};

const AlbumList: FC<IAlbumList> = ({
  display, search, selectedLibraries, setStartsWithFilter, startsWithFilter,
}) => {
  const settings = useContext(SettingsContext);
  const { preferences, screen } = settings;
  const { startsWithLocation } = preferences || {};
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState(0);
  const [lastSearch, setLastSearch] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const { state } = useLocation();
  const { isScreenSmall } = settings;
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const noResults = search && !albums.length && !isLoading;
  const cols = startsWithLocation === 'none' ? '12' : '11';
  let category = state?.category;
  const { pathname } = window.location;
  const pageSize = screen?.isMobile ? 6 : usePageSize(display, settings);

  if (!category && pathname.includes('/categories')) {
    category = pathname.slice(window.location.pathname.lastIndexOf('/') + 1, pathname.length);
  }

  useEffect(() => {
    applyLighting(settings, 'Albums');
  }, []);

  const findAlbums = async (start: number, limit: number) => {
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

    if (selectedPage && pageSize) {
      setAlbums([]);
      if (search || startsWithFilter) {
        findAlbums(start, (start + pageSize));
      } else {
        const musicCategory = category === 'Albums' ? null : category;

        getAlbums(start, end, musicCategory, selectedLibraries, preferences?.restrictionGroup)
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
    setIsLoading(true);
    loadAlbums();
  }, [category, pageSize, selectedPage, selectedLibraries, search, startsWithFilter]);

  const paginator = (
    <Paginator
      onPageChange={(page: any) => setSelectedPage(page)}
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
      {loadComplete && totalAlbums === 0 && <NoAlbumsLoaded />}
      {noResults && <NoAlbumSearchResults />}
      {isLoading && <Loading text="Loading..." />}
      {!isLoading && !noResults && screen?.isMobile && <VerticalAlbumList albums={albums} selectedPage={selectedPage} setSelectedPage={setSelectedPage}
      />}
      {!isLoading && !noResults && !screen?.isMobile && (
        <Container {...swipe} fluid className="albumListContainer">
          <Row className="containerRow">
            <>
              {startsWithLocation === 'left' && !screen?.isTabletOrSmaller && !search && startsWithCol}
              <Col lg={cols} xl={cols} md={cols} sm={cols} className="centerCol">
                {display !== 'grid' && (
                  <Container fluid>
                    <Row className="albumRow">
                      {albums.map(album => <Album album={album} coverArtOnly={false} />)}
                    </Row>
                    <Row className="albumRow">
                      {(totalAlbums > pageSize) && startsWithLocation !== 'none' && !search && !screen?.isTabletOrSmaller && paginator}
                    </Row>
                  </Container>
                )}
                {display === 'grid' && <AlbumTable albums={albums} />}
              </Col>
              {startsWithLocation === 'right' && !screen?.isTabletOrSmaller && !search && startsWithCol}
            </>
          </Row>
          {(startsWithLocation === 'none' || search) && (
            <FullWidthRow>
              {(totalAlbums > pageSize) && !screen?.isTabletOrSmaller && paginator}
            </FullWidthRow>
          )}
        </Container>
      )}
    </>
  );
};

export default AlbumList;
