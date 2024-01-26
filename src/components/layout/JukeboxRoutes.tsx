import React, { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

const AlbumDetail = React.lazy(() => import('../albums/AlbumDetail/AlbumDetail'));
const AlbumList = React.lazy(() => import('../albums/AlbumList/AlbumList'));
const Genres = React.lazy(() => import('../genres/Genres/Genres'));
const PlaylistsViewer = React.lazy(() => import('../playlists/PlaylistViewer/PlaylistsViewer'));
const Queue = React.lazy(() => import('../queue/Queue/Queue'));
const RadioList = React.lazy(() => import('../radio/RadioList/RadioList'));
const Search = React.lazy(() => import('../common/Search/Search'));
const Settings = React.lazy(() => import('../settings/Settings'));
const Tracks = React.lazy(() => import('../albums/Tracks/Tracks'));
const WithKeyboardInput = React.lazy(() => import('./WithKeyboardInput'));
const Info = React.lazy(() => import('./Navigation/Info/Info'));

interface IJukeboxRoutes {
  display: string,
  search: string,
  selectedLibraries: [string],
  setMediaType: Function,
  setSearch: Function,
  setSelectedLibraries: Function,
  setStartsWithFilter: Function,
  setTempSearch: Function,
  startsWithFilter: string,
  tempSearch: string,
}

const JukeboxRoutes: FC<IJukeboxRoutes> = ({
  display,
  search,
  selectedLibraries,
  setMediaType,
  setSearch,
  setSelectedLibraries,
  setStartsWithFilter,
  setTempSearch,
  startsWithFilter,
  tempSearch,
}) => {
  const wrapWithKeyboard = (component: any) => (
    <WithKeyboardInput
      component={component}
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      debouncedSearch={setSearch}
    />
  );

  return (
    <Routes>
      <Route
        path="/"
        element={wrapWithKeyboard(
          <AlbumList
            selectedLibraries={selectedLibraries}
            search={search}
            setStartsWithFilter={setStartsWithFilter}
            startsWithFilter={startsWithFilter}
            display={display}
          />,
        )}
      />
      <Route
        path="/albums"
        element={wrapWithKeyboard(
          <AlbumList
            setStartsWithFilter={setStartsWithFilter}
            startsWithFilter={startsWithFilter}
            selectedLibraries={selectedLibraries}
            display={display}
            search={search}
          />,
        )}
      />
      <Route path="/albums/:id" element={<AlbumDetail />} />
      <Route path="/albums/categories/:id" element={<AlbumList search={search} display={display} />} />
      <Route path="/playlists" element={<PlaylistsViewer />} />
      <Route path="/queue" element={<Queue />} />
      <Route path="/search" element={<Search setSearchText={setSearch} />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/tracks" element={wrapWithKeyboard(<Tracks search={search} />)} />
      <Route path="/radio" element={wrapWithKeyboard(<RadioList setMediaType={setMediaType} />)} />
      <Route path="/genres" element={<Genres />} />
      <Route path="/info" element={<Info />} />
    </Routes>
  );
};

export default JukeboxRoutes;
