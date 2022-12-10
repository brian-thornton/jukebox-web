import React, { useContext, useEffect, useState } from 'react';
import { PencilSquare } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

import AddNew from '../../common/AddNew';
import Button from '../../Button';
import { pageSize } from '../../../lib/styleHelper';
import RestrictionModeDetail from './RestrictionModeDetail';
import { SettingsContext } from '../../layout/SettingsProvider';
import { createRestrictionGroup, getRestrictionGroups, updateRestrictionGroup } from '../../../lib/settings-client';
import { updatePreference } from '../../../lib/preferenceHelper';
import PaginatedList from '../../common/PaginatedList';
import { Album } from '../../shapes';

const propTypes = {
  addMode: PropTypes.bool,
  addComplete: PropTypes.func,
  album: Album,
};

const RestrictionModes = ({ addMode, addComplete, album }) => {
  const settings = useContext(SettingsContext);
  const { preferences } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [isAddOpen, setIsAddOpen] = useState();
  const [selectedRestrictionMode, setSelectedRestrictionMode] = useState();
  const [restrictionGroups, setRestrictionGroups] = useState();
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  const loadRestrictionGroups = async () => {
    const data = await getRestrictionGroups();
    setRestrictionGroups(data);
  };

  useEffect(() => {
    setRealPageSize(pageSize('item', 300));
    loadRestrictionGroups();
  }, []);

  const addAlbumToRestrictedList = (album, restrictionGroup) => {
    if (!restrictionGroup.content.includes(album.path)) {
      restrictionGroup.content.push(album.path);
      updateRestrictionGroup(restrictionGroup);
    }

    addComplete();
  };

  const onAddRestrictionGroup = async (group) => {
    await createRestrictionGroup({
      name: group.name,
      type: 'blacklist',
      content: [],
    });


    await loadRestrictionGroups();
    setIsAddOpen(false);
  };

  const itemButtons = restrictionGroup => (
    <>
      {!addMode && (
        <>
          <Button
            onClick={() => setSelectedRestrictionMode(restrictionGroup)}
            content={<PencilSquare />}
          />
          <Button
            isSelected={settings.preferences.restrictionGroup === restrictionGroup.name}
            onClick={() => {
              const isSet = preferences.restrictionGroup === restrictionGroup.name;
              updatePreference(settings, 'restrictionGroup', isSet ? '' : restrictionGroup.name);
            }}
            content="Enable"
          />
        </>
      )}
      {addMode && (
        <Button
          onClick={() => addAlbumToRestrictedList(album, restrictionGroup)}
          content="Add"
        />
      )}
    </>
  );

  const items = () => (
    restrictionGroups.slice(realStart, (realStart + realPageSize)).map(restrictionGroup => (
       {
        text: `${restrictionGroup.name} (${restrictionGroup.type})`,
        buttons: itemButtons(restrictionGroup),
      }
    ))
  );

  return (
    <>
      {selectedRestrictionMode && (
        <RestrictionModeDetail
          onClose={() => setSelectedRestrictionMode(null)}
          restrictionMode={selectedRestrictionMode}
        />
      )}
      {!selectedRestrictionMode && isAddOpen && (
        <AddNew
          title="Add Restriction Group"
          onConfirm={onAddRestrictionGroup}
          onCancel={() => setIsAddOpen(false)}
        />
      )}
      {!selectedRestrictionMode && !isAddOpen && restrictionGroups?.length > 0 && (
        <PaginatedList
          items={items()}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={realPageSize}
        />
      )}
    </>
  );
};

RestrictionModes.defaultProps = {
  addMode: false,
  addComplete: null,
  album: null,
};

RestrictionModes.propTypes = propTypes;

export default RestrictionModes;
