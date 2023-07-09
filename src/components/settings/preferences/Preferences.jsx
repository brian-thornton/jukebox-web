import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { SettingsContext } from '../../layout/SettingsProvider';
import PreferenceRadioRow from './PreferenceRadioRow';
import PreferenceTextRow from './PreferenceTextRow';
import PreferenceToggleRow from './PreferenceToggleRow';
import { calculatePageSize } from '../../../lib/styleHelper';
import PaginatedList from '../../common/PaginatedList';
import ToggleActions from './ToggleAction';

const Preferences = () => {
  const settings = useContext(SettingsContext);
  const { preferences, screen } = settings;
  const [itemsPerPage, setItemsPerPage] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [toggleActions, setToggleActions] = useState();
  useEffect(() => {
    if (!screen.isMobile) {
      setItemsPerPage(calculatePageSize('item', 250, 60));
    } else {
      setItemsPerPage(10);
    }
  }, []);
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  const startsWithFilterOptions = [
    { display: <FormattedMessage id="none" />, value: 'none' },
    { display: <FormattedMessage id="left" />, value: 'left' },
    { display: <FormattedMessage id="right" />, value: 'right' },
  ];

  const albumCoverSize = [
    { display: <FormattedMessage id="small" />, value: 'small' },
    { display: <FormattedMessage id="medium" />, value: 'medium' },
    { display: <FormattedMessage id="large" />, value: 'large' },
  ];

  const onClose = () => {
    setIsToggleOpen(false);
    setToggleActions(null);
  };

  const openToggle = (name, value) => {
    setIsToggleOpen(true);
    setToggleActions(<ToggleActions name={name} value={value} onClose={onClose} />)
  };

  const toggleProps = {
    openToggle,
  };

  const items = [
    <PreferenceTextRow rowName="name" value={preferences.name} />,
    <PreferenceToggleRow {...toggleProps} name="useLightingControllers" value={preferences.useLightingControllers} />,
    <PreferenceToggleRow {...toggleProps} name="showAlbumName" value={preferences.showAlbumName} />,
    <PreferenceToggleRow {...toggleProps} name="showAlbumsWithoutCoverArt" value={preferences.showAlbumsWithoutCoverArt} />,
    <PreferenceToggleRow {...toggleProps} name="pinEnabled" value={preferences.pinEnabled} />,
    <PreferenceToggleRow {...toggleProps} name="experimentalMode" value={preferences.experimentalMode} />,
    <PreferenceTextRow rowName="pin" value={preferences.pin} />,
    <PreferenceRadioRow rowName="Starts with Filter" preferenceName="startsWithLocation" options={startsWithFilterOptions} />,
    <PreferenceRadioRow rowName="Album Size" preferenceName="coverSize" options={albumCoverSize} />,
    <PreferenceToggleRow {...toggleProps} name="showLibraryFilter" value={preferences.showLibraryFilter} />,
    <PreferenceToggleRow {...toggleProps} name="showAlbumTable" value={preferences.showAlbumTable} />,
    <PreferenceTextRow rowName="vlcHost" value={preferences.vlcHost} />,
    <PreferenceTextRow rowName="vlcPort" value={preferences.vlcPort} />,
    <PreferenceTextRow rowName="vlcPassword" value={preferences.vlcPassword} />,
  ];

  return (
    <>
      {isToggleOpen && toggleActions}
      {!isToggleOpen && (
        <PaginatedList
          items={items.slice(start, (start + itemsPerPage))}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={itemsPerPage}
          totalItems={14}
          hideButtons={screen.isMobile}
        />
      )}
    </>
  );
};

export default Preferences;
