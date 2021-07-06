import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import { getAlbums, searchAlbums } from '../../lib/librarian-client';
import Album from './Album';
import PagedContainer from '../common/PagedContainer';
import {
  clearCurrentPage,
  getHeight,
  initHorizontalPaging,
  saveCurrentPage,
  setKnownPage,
} from '../../lib/pageHelper';
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
  const [paging, setPaging] = useState();
  const [initialHeight, setInitialHeight] = useState(getHeight());
  const size = useWindowSize();
  const [lastSize, setLastSize] = useState();
  const content = [];
  const [searchPageSet, setSearchPageSet] = useState(false);
  const [totalAlbums, setTotalAlbums] = useState();

  useEffect(() => {
    if (lastSize && lastSize.width !== size.width && lastSize.height !== size.height) {
      setIsLoading(true);
      clearCurrentPage('albums');
    }

    setLastSize(size);
  }, [size])

  const applyPageIfExists = (pageData, useStorePage, status) => {
    if (useStorePage) {
      try {
        const updated = setKnownPage(pageData, status.currentPages.albums);
        setPaging(updated);
      } catch {
        setPaging(pageData);
      }
    } else {
      setPaging(pageData);
    }
  }

  const initPaging = (totalAlbums) => {
    const pageData = initHorizontalPaging(totalAlbums, 275, initialHeight, 225);
    getStatus().then((status) => {
      if (!paging) {
        applyPageIfExists(pageData, status.currentPages.albums, status)
      } else if (!search && paging && status.currentPages && status.currentPages.albums) {
        applyPageIfExists(pageData, !status.currentPages.albums, status)
      } else {
        setPaging(pageData);
      }
    })
  }

  useEffect(() => {
    if (!paging && albums.length) {
      initPaging(totalAlbums);
    }
  }, [albums])

  const findAlbums = async (start, limit) => {
    await clearCurrentPage('albums');
    setAlertText('Searching...');
    searchAlbums(search, start, limit).then((data) => {
      if (!data.albums.length) {
        setAlertText('No results found.');
      } else {
        setAlbums(data.albums);
        if (!searchPageSet) {
          setTotalAlbums(data.albums.length);
          setSearchPageSet(true);
          initPaging(data.totalAlbums);
        }
      }
      window.scrollTo(0, 0);
      setIsLoading(false);
    }).catch(err => console.log(err));
  };

  const loadAlbums = (loadPage) => {
    const start = loadPage ? loadPage.start : paging ? paging.currentPage.start : 0;
    let limit = loadPage ? loadPage.limit : paging ? paging.currentPage.limit : 5;

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
