import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import Album from './Album';
import PagedContainer from '../common/PagedContainer';
import {
  clearCurrentPage,
  initPaging,
  saveCurrentPage,
} from '../../lib/pageHelper';

import { useWindowSize } from '../../lib/hooks';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function AlbumList({ search, setCurrentAlbum }) {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertText, setAlertText] = useState('Loading albums...');
  const [paging, setPaging] = useState();;
  const size = useWindowSize();
  const [lastSize, setLastSize] = useState();
  let content = [];
  const [searchPageSet, setSearchPageSet] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState();
  const [lastSearch, setLastSearch] = useState('');

  useEffect(() => {
    if (lastSize && lastSize.width !== size.width && lastSize.height !== size.height) {
      setIsLoading(true);
      clearCurrentPage('albums');
    }

    setLastSize(size);
  }, [size])

  const establishPaging = async (totalItems) => {
    const pageData = await initPaging(totalItems, search, 'albums')
    setPaging(pageData);
  };

  useEffect(() => {
    if (!paging && albums.length && totalAlbums) {
      establishPaging(totalAlbums);
    }
  }, [albums])

  const findAlbums = async (start, limit) => {
    await clearCurrentPage('albums');
    setAlertText('Searching...');
    searchAlbums(search, start, limit).then((data) => {
      if (!data.albums.length) {
        setAlertText('No results found.');
      } else {
        setTotalAlbums(data.albums.length);
        setAlbums(data.albums);
        if (search !== lastSearch) {
          setLastSearch(search);
          setSearchPageSet(true);
          establishPaging(data.albums.length);
        }
      }
      window.scrollTo(0, 0);
      setIsLoading(false);
    }).catch(err => console.log(err));
  };

  const loadAlbums = (loadPage) => {
    const start = loadPage ? loadPage.start : (paging && paging.currentPage) ? paging.currentPage.start : 0;
    let limit = loadPage ? loadPage.limit : (paging && paging.currentPage) ? paging.currentPage.limit : 5;

    if (!isLoading) {
      setIsLoading(true);
      setAlbums([]);
      if (search) {
        const searchStart = searchPageSet ? start : 0;
        const searchEnd = searchPageSet ? limit : paging ? paging.pageSize : 5;
        findAlbums(searchStart, searchEnd);
      } else {
        if (start === 0) {
          limit += 1;
        }

        getAlbums(start, limit).then((data) => {
          if (!data.length) {
            setAlertText('No albums found. Set up your library in settings.');
          }

          setTotalAlbums(data.totalAlbums);
          setAlbums(data.albums);
          window.scrollTo(0, 0);
          setIsLoading(false);
        });
      }
    }
  }

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
    content = albums.map((album) => <Album album={album} setCurrentAlbum={setCurrentAlbum} />);

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

  return <React.Fragment />;
}

AlbumList.propTypes = propTypes;

AlbumList.defaultProps = {
  search: '',
};

export default AlbumList;
