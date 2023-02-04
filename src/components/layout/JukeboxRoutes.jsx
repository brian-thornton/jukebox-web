import React from 'react';
import { Routes, Route } from "react-router-dom";

const AlbumDetail = React.lazy(() => import("../albums/AlbumDetail"));
const AlbumList = React.lazy(() => import("../albums/AlbumList"));
const Filters = React.lazy(() => import("../layout/Filters"));
const PlaylistsViewer = React.lazy(() => import("../playlists/PlaylistsViewer"));
const Queue = React.lazy(() => import("../queue/Queue"));
const RadioList = React.lazy(() => import("../radio/RadioList"));
const Search = React.lazy(() => import("../common/Search"));
const Settings = React.lazy(() => import("../settings/Settings"));
const Tracks = React.lazy(() => import("../Tracks"));
const WithKeyboardInput = React.lazy(() => import("../layout/WithKeyboardInput"));
const Genres = React.lazy(() => import("../genres/Genres"));

const JukeboxRoutes = ({
  selectedLibraries,
  setSelectedLibraries,
  search,
  setStartsWithFilter,
  startsWithFilter,
  display,
  setMediaType,
  tempSearch,
  setTempSearch,
  setSearch,
}) => {
  const wrapWithKeyboard = (component) => (
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
          />
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
          />
        )}
      />
      <Route path="/albums/:id" element={<AlbumDetail />} />
      <Route path="/albums/categories/:id" element={<AlbumList />} search={search} display={display} />
      <Route path="/filters" element={(
        <Filters
          selectedLibraries={selectedLibraries}
          setSelectedLibraries={setSelectedLibraries}
        />
      )}
      />
      <Route path="/playlists" element={<PlaylistsViewer />} />
      <Route path="/queue" element={<Queue />} />
      <Route path="/search" element={<Search setSearchText={setSearch} />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/tracks" element={wrapWithKeyboard(<Tracks setSearch={setSearch} search={search} />)} />
      <Route path="/radio" element={wrapWithKeyboard(<RadioList setMediaType={setMediaType} />)} />
      <Route path="/genres" element={<Genres />} />
    </Routes>
  );
};

export default JukeboxRoutes;