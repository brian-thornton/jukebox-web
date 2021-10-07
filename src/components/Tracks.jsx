import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { getTracks, searchTracks } from '../lib/librarian-client';
import TrackList from './TrackList';
import {
  clearCurrentPage,
  getHeight,
  initHorizontalPaging,
  pageStart,
  pageLimit,
  saveCurrentPage,
  setKnownPage,
} from '../lib/pageHelper';
import PagedContainer from './common/PagedContainer';
import { getStatus } from '../lib/status-client';

const propTypes = {
  search: PropTypes.string,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function Tracks({ search, setCurrentAlbum }) {
  const [paging, setPaging] = useState();
  const [tracks, setTracks] = useState([]);
  const [searchPageSet, setSearchPageSet] = useState(false);
  const [totalTracks, setTotalTracks] = useState();
  const initialHeight = getHeight();
  const [isLoading, setIsLoading] = useState(false);

  const applyPageIfExists = (pageData, useStorePage, status) => {
    if (useStorePage) {
      try {
        const updated = setKnownPage(pageData, status.currentPages.tracks);
        setPaging(updated);
      } catch (error) {
        setPaging(pageData);
      }
    } else {
      setPaging(pageData);
    }
  };

  const findTracks = async (start, limit) => {
    await clearCurrentPage('tracks');
    searchTracks(search, start, limit).then((data) => {
      setTotalTracks(data.totalTracks);
      setTracks(data.tracks);
      setIsLoading(false);
      if (!searchPageSet) {
        setPaging(initHorizontalPaging(totalTracks, 175, getHeight(), 300));
        setSearchPageSet(true);
      }
    });
  };

  const initPaging = () => {
    const pageData = initHorizontalPaging(totalTracks, 275, initialHeight, 225);
    getStatus().then((status) => {
      if (!paging) {
        applyPageIfExists(pageData, status.currentPages.tracks, status);
      } else if (!search && paging && status.currentPages && status.currentPages.tracks) {
        applyPageIfExists(pageData, !status.currentPages.tracks, status);
      } else {
        setPaging(pageData);
      }
    });
  };

  useEffect(() => {
    if (!paging && tracks.length) {
      initPaging();
    }
  }, [tracks]);

  const loadTracks = (loadPage) => {
    const start = pageStart(loadPage, paging);
    let limit = pageLimit(loadPage, paging);

    if (search) {
      findTracks(start, limit);
    } else {
      if (start === 0) {
        limit += 1;
      }

      getTracks(start, limit).then((data) => {
        setTotalTracks(data.totalTracks);
        setTracks(data.tracks);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => loadTracks(), [search]);

  const alert = () => {
    const alertText = "Loading tracks.  If you don't see any results, set up your library in Settings.";
    if (!tracks || !tracks.length) {
      return <Alert variant="primary">{alertText}</Alert>;
    }
    return <React.Fragment />;
  };

  useEffect(() => {
    if (!isLoading && paging && paging.currentPage !== 0) {
      if (paging.currentPage || !search) {
        setIsLoading(true);
        loadTracks(paging.currentPage);
      }
      saveCurrentPage(paging.currentPage, 'tracks');
    }
  }, [paging]);

  const content = (
    <TrackList
      style={{ width: '100%', marginRight: '0px' }}
      tracks={tracks}
      showAlbumCovers
      setCurrentAlbum={setCurrentAlbum}
    />
  );

  const trackList = () => {
    if (paging && tracks.length) {
      return (
        <PagedContainer
          search={search}
          setPaging={setPaging}
          paging={paging}
          content={content}
          isHorizontal
        />
      );
    }

    return <React.Fragment />;
  };

  return (
    <>
      {alert()}
      {trackList()}
    </>
  );
}

Tracks.propTypes = propTypes;
Tracks.defaultProps = {
  search: '',
};

export default Tracks;
