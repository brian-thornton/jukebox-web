import React, { useContext, useEffect, useState } from 'react';

import { SettingsContext } from '../../layout/SettingsProvider';
import PreferenceRadioRow from './PreferenceRadioRow';
import PreferenceTextRow from './PreferenceTextRow';
import PreferenceToggleRow from './PreferenceToggleRow';
import { calculatePageSize } from '../../../lib/styleHelper';
import PaginatedList from '../../common/PaginatedList';

const Preferences = () => {
  const settings = useContext(SettingsContext);
  const { preferences } = settings;
  const [itemsPerPage, setItemsPerPage] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  useEffect(() => setItemsPerPage(calculatePageSize('item', 250, 60)), []);
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  const startsWithFilterOptions = [
    { display: 'None', value: 'none' },
    { display: 'Left', value: 'left' },
    { display: 'Right', value: 'right' },
  ];

  const albumCoverSize = [
    { display: 'Small', value: 'small' },
    { display: 'Medium', value: 'medium' },
    { display: 'Large', value: 'large' },
  ];

  const items = [
    <PreferenceTextRow rowName="name" value={preferences.name} />,
    <PreferenceToggleRow name="useLightingControllers" value={preferences.useLightingControllers} />,
    <PreferenceToggleRow name="showAlbumName" value={preferences.showAlbumName} />,
    <PreferenceToggleRow name="showAlbumsWithoutCoverArt" value={preferences.showAlbumsWithoutCoverArt} />,
    <PreferenceToggleRow name="pinEnabled" value={preferences.pinEnabled} />,
    <PreferenceToggleRow name="experimentalMode" value={preferences.experimentalMode} />,
    <PreferenceTextRow rowName="pin" value={preferences.pin} />,
    <PreferenceRadioRow rowName="Starts with Filter" preferenceName="startsWithLocation" options={startsWithFilterOptions} />,
    <PreferenceRadioRow rowName="Album Size" preferenceName="coverSize" options={albumCoverSize} />,
    <PreferenceToggleRow name="showLibraryFilter" value={preferences.showLibraryFilter} />,
    <PreferenceToggleRow name="showAlbumTable" value={preferences.showAlbumTable} />,
    <PreferenceTextRow rowName="vlcHost" value={preferences.vlcHost} />,
    <PreferenceTextRow rowName="vlcPort" value={preferences.vlcPort} />,
    <PreferenceTextRow rowName="vlcPassword" value={preferences.vlcPassword} />,
  ]

  return (
    <PaginatedList
      items={items.slice(start, (start + itemsPerPage))}
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      pageSize={itemsPerPage}
      totalItems={14}
    />
  )
};

export default Preferences;
