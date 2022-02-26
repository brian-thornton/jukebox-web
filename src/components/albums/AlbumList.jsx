import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import {
  Container,
  Col,
  Row,
} from 'react-bootstrap';

import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import { getStatus } from '../../lib/status-client';

import Album from './Album';
import NoResults from '../common/NoResults';
import Paginator from '../common/Paginator';

import { useWindowSize } from '../../lib/hooks';
import './AlbumList.scss';

const propTypes = {
  category: PropTypes.string,
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function AlbumList({ category, search, setCurrentAlbum }) {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const size = useWindowSize();
  const [lastSize, setLastSize] = useState();
  const [totalAlbums, setTotalAlbums] = useState();
  const [lastSearch, setLastSearch] = useState('');
  const [status, setStatus] = useState();
  const [content, setContent] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();

  useEffect(() => {
    getStatus().then(data => setStatus(data));

    const albumsPerRow = Math.floor(window.innerWidth / 225);
    const numberOfRows = Math.floor((window.innerHeight - 200) / 200);
    const s = albumsPerRow * numberOfRows;
    setRealPageSize(s);
  }, []);

  useEffect(() => {
    if (lastSize && lastSize.width !== size.width && lastSize.height !== size.height) {
      setIsLoading(true);
    }

    setLastSize(size);
  }, [size]);

  useEffect(() => {
    setContent(albums.map(album => <Album album={album} setCurrentAlbum={setCurrentAlbum} />));
  }, [albums]);

  const findAlbums = async (start, limit) => {
    searchAlbums(search, start, limit).then((data) => {
      if (data.albums.length) {
        console.log(data);
        setTotalAlbums(data.totalAlbums);
        setAlbums(data.albums);
        if (search !== lastSearch) {
          setLastSearch(search);
        }
      }
      window.scrollTo(0, 0);
      setIsLoading(false);
    }).catch((e) => {
      console.log('Bad search');
      console.log(e);
    });
  };

  const loadAlbums = () => {
    // 1: 0
    // 2: 2 * 12 == 24 - 12 = 12
    // 3: 3 * 12 == 36 - 12 = 24
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

    if (!isLoading && selectedPage && realPageSize) {
      setIsLoading(true);
      setAlbums([]);
      if (search) {
        findAlbums(realStart, (realStart + realPageSize));
      } else {
        const musicCategory = category === 'Albums' ? null : category;

        getAlbums(realStart, (realStart + realPageSize), musicCategory).then((data) => {
          setTotalAlbums(data.totalAlbums);
          setAlbums(data.albums);
          window.scrollTo(0, 0);
          setIsLoading(false);
          setLoadComplete(true);
        });
      }
    }
  };

  useEffect(loadAlbums, [category]);
  useEffect(loadAlbums, [realPageSize]);
  useEffect(loadAlbums, [selectedPage]);

  useEffect(() => {
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

  if (albums && albums.length) {
    return (
      <>
        <Container fluid style={{ marginTop: '60px' }}>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row>{content}</Row>
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Paginator
                onPageChange={onPageChange}
                style={{ marginTop: '100px' }}
                selectedPage={selectedPage}
                totalItems={totalAlbums}
                pageSize={realPageSize}
              />
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (loadComplete && totalAlbums === 0) {
    return (
      <div className="no-albums">
        <NoResults title="No Albums Loaded" text="No Albums Found. Configure your library in Settings." />
      </div>
    );
  }

  return <></>;
}

AlbumList.propTypes = propTypes;

AlbumList.defaultProps = {
  search: '',
};

export default AlbumList;
