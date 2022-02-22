import React, { useContext, useState, useEffect } from 'react';
import { number, PropTypes } from 'prop-types';

import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import { getStatus } from '../../lib/status-client';

import Album from './Album';
import NoResults from '../common/NoResults';
import PagedContainer from '../common/PagedContainer';
import {
  clearCurrentPage,
  initPaging,
  pageLimit,
  pageStart,
  saveCurrentPage,
} from '../../lib/pageHelper';

import { SettingsContext } from '../layout/SettingsProvider';
import { useWindowSize } from '../../lib/hooks';

const propTypes = {
  category: PropTypes.string,
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function AlbumList({ category, search, setCurrentAlbum, setPagingButtons }) {
  const settings = useContext(SettingsContext);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [paging, setPaging] = useState();
  const size = useWindowSize();
  const [lastSize, setLastSize] = useState();
  const [searchPageSet, setSearchPageSet] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState();
  const [lastSearch, setLastSearch] = useState('');
  const [status, setStatus] = useState();
  const [resetPaging, setResetPaging] = useState(false);
  const [content, setContent] = useState([]);

  const albumsPerRow = Math.floor(size.width / 225);
  const numberOfRows = Math.floor((size.height - 200) / 200);

  useEffect(() => {
    getStatus().then(data => setStatus(data));
  }, []);

  useEffect(() => {
    if (lastSize && lastSize.width !== size.width && lastSize.height !== size.height) {
      setIsLoading(true);
      clearCurrentPage('albums');
    }

    setLastSize(size);
  }, [size]);

  const establishPaging = async (totalItems) => {
    const pageData = await initPaging((albumsPerRow * numberOfRows), totalItems, search, 'albums');
    setPaging(pageData);
  };

  useEffect(() => {
    if (status) {
      if (category === 'Albums' && !paging && albums.length && totalAlbums) {
        establishPaging(totalAlbums);
        setResetPaging(false);
      } else if (!paging && albums.length) {
        establishPaging(status.categoryAlbums[category]);
      }
    }

    setContent(albums.map(album => <Album album={album} setCurrentAlbum={setCurrentAlbum} />));
  }, [albums]);

  const findAlbums = async (start, limit) => {
    await clearCurrentPage('albums');
    searchAlbums(search, start, limit).then((data) => {
      if (data.albums.length) {
        setTotalAlbums(data.totalAlbums);
        setAlbums(data.albums);
        if (search !== lastSearch) {
          setLastSearch(search);
          setSearchPageSet(true);
          establishPaging(data.totalAlbums - 1);
        }
      }
      window.scrollTo(0, 0);
      setIsLoading(false);
    }).catch(() => { });
  };

  const loadAlbums = (loadPage) => {
    const start = pageStart(loadPage, paging);
    let limit = pageLimit(loadPage, paging);

    if (!isLoading) {
      setIsLoading(true);
      setAlbums([]);
      if (search) {
        const searchStart = searchPageSet ? start : 0;
        const searchLimit = paging ? paging.pageSize : 5;
        const searchEnd = searchPageSet ? limit : searchLimit;
        findAlbums(searchStart, searchEnd);
      } else {
        if (start === 0) {
          limit += 1;
        }

        const musicCategory = category === 'Albums' ? null : category;

        getAlbums(start, limit, musicCategory).then((data) => {
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
    setPaging(null);
    loadAlbums();
  }, [category]);

  useEffect(() => {
    if (!search) {
      setSearchPageSet(null);

      if (albums.length) {
        window.location.reload();
      }
    }

    loadAlbums();
  }, [search]);

  useEffect(() => {
    if (!isLoading && paging && paging.currentPage !== 0) {
      if (paging.currentPage || !search) {
        setIsLoading(true);
        loadAlbums(paging.currentPage);
      }
      saveCurrentPage(paging.currentPage, 'albums');
    }
  }, [paging]);

  if (albums && albums.length) {
    if (paging) {
      return (
        <PagedContainer
          setPaging={setPaging}
          paging={paging}
          content={content}
          isHorizontal
        />
      );
    }
  }

  if (loadComplete && totalAlbums === 0) {
    return (
      <div style={{ marginTop: '60px' }}>
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
