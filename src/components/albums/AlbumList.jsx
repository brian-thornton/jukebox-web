import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import {
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import Album from './Album';
import PagedContainer from '../common/PagedContainer';
import { getHeight, initHorizontalPaging, clearCurrentPage, saveCurrentPage, setKnownPage } from '../../lib/pageHelper';
import { getStatus } from '../../lib/status-client';
import { useWindowSize } from '../../lib/hooks';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function AlbumList({ search, setCurrentAlbum }) {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertText, setAlertText] = useState('Loading albums...');
  const isScreenSmall = window.innerWidth < 700;
  const [paging, setPaging] = useState();
  const [initialHeight, setInitialHeight] = useState(getHeight());
  const size = useWindowSize();
  const [lastSize, setLastSize] = useState();
  const content = [];

  useEffect(() => {
    if (lastSize && lastSize.width !== size.width && lastSize.height !== size.height) {
      setIsLoading(true);
      clearCurrentPage('albums');
    }

    setLastSize(size);
  }, [size])

  const loadAlbums = (loadPage) => {
    setIsLoading(true);
    setAlbums([]);

    if (search) {
      setAlertText('Searching...');
      searchAlbums(search).then((data) => {
        if (!data.length) {
          setAlertText('No results found.');
        } else {
          setAlbums(data);
        }
        window.scrollTo(0, 0);
        setIsLoading(false);
      });
    } else {
      const start = loadPage ? loadPage.start : paging ? paging.currentPage.start : 0;
      let limit = loadPage ? loadPage.limit : paging ? paging.currentPage.limit : 5;

      if (start === 0) {
        limit += 1;
      }

      getAlbums(start, limit).then((data) => {
        if (paging && paging.currentPage.start === 0) {
          if (!data.length) {
            setAlertText('No albums found. Set up your library in settings.');
          }
          setAlbums(data.albums);
        } else {
          setAlbums(data.albums);
        }

        if (!paging) {
          getStatus().then((status) => {
            if (status.currentPages && status.currentPages.albums) {
              const p = initHorizontalPaging(data.totalAlbums, 275, initialHeight, 225);

              try {
                const updated = setKnownPage(p, status.currentPages.albums);
                setPaging(updated);
              } catch {
                setPaging(initHorizontalPaging(data.totalAlbums, 275, initialHeight, 225));
              }
            } else {
              setPaging(initHorizontalPaging(data.totalAlbums, 275, initialHeight, 225));
            }
          })
        }

        window.scrollTo(0, 0);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    if (search || (!isLoading)) {
      loadAlbums();
    }
  }, [search]);

  useEffect(() => {
    if (paging) {
      if (paging.currentPage) {
        loadAlbums(paging.currentPage);
        saveCurrentPage(paging.currentPage, 'albums');
      } else {
        loadAlbums(paging.currentPage);
      }
      saveCurrentPage(paging.currentPage, 'albums');
    }
  }, [paging]);

  const albumsMargin = () => (
    isScreenSmall ? {} : { marginLeft: '0px', marginTop: '90px', height: '100%' }
  );

  if (albums && albums.length) {
    albums.forEach((album) => {
      content.push(
        <Album
          album={album}
          setCurrentAlbum={setCurrentAlbum}
        />,
      );
    });

    if (paging) {
      return (
        <PagedContainer 
          search={search}
          setPaging={setPaging}
          paging={paging}
          content={content}
          isHorizontal
        />
      );
    } else if (search && albums) {
      return (
        <Container id="albums" fluid style={albumsMargin()}>
          <Row>
            <Col lg={11} xl={11}>
              <Row>{content}</Row>
            </Col>
          </Row>
        </Container>
      );
    }

    return null;
  }

  return <React.Fragment />;
}

AlbumList.propTypes = propTypes;

AlbumList.defaultProps = {
  search: '',
};

export default AlbumList;
