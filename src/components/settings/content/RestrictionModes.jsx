import React, { useContext, useEffect, useState } from 'react';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import AddNew from '../../common/AddNew';
import Button from '../../Button';
import { calculatePageSize } from '../../../lib/styleHelper';
import RestrictionModeDetail from './RestrictionModeDetail';
import { SettingsContext } from '../../layout/SettingsProvider';
import { createRestrictionGroup, deleteRestrictionGroup, getRestrictionGroups, updateRestrictionGroup } from '../../../lib/settings-client';
import { updatePreference } from '../../../lib/preferenceHelper';
import PaginatedList from '../../common/PaginatedList';
import { Album } from '../../shapes';
import NoResults from '../../common/NoResults';
import Confirm from '../../common/Confirm';

const propTypes = {
  addMode: PropTypes.bool,
  addComplete: PropTypes.func,
  album: Album,
};

const RestrictionModes = ({ addMode, addComplete, album, intl }) => {
  const settings = useContext(SettingsContext);
  const { preferences } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [isAddOpen, setIsAddOpen] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRestrictionMode, setSelectedRestrictionMode] = useState();
  const [restrictionGroups, setRestrictionGroups] = useState();
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  const loadRestrictionGroups = async () => {
    const data = await getRestrictionGroups();
    setRestrictionGroups(data);
  };

  useEffect(() => {
    setRealPageSize(calculatePageSize('item', 300));
    loadRestrictionGroups();
  }, []);

  const addAlbumToRestrictedList = (album, restrictionGroup) => {
    if (!restrictionGroup.content.includes(album.path)) {
      restrictionGroup.content.push(album.path);
      updateRestrictionGroup(restrictionGroup);
    }

    addComplete();
  };

  const onAddRestrictionGroup = async (group, dropdowns) => {
    await createRestrictionGroup({
      name: group.name,
      type: dropdowns[0].value,
      content: [],
    });


    await loadRestrictionGroups();
    setIsAddOpen(false);
  };

  const onDeleteRestrictionGroup = async () => {
    await deleteRestrictionGroup({ name: selectedRestrictionMode.name });
    setIsDeleteOpen(false);
    setSelectedRestrictionMode(null);
    loadRestrictionGroups();
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
            onClick={() => {
              setSelectedRestrictionMode(restrictionGroup);
              setIsDeleteOpen(true)
            }}
            content={<Trash />}
          />
          <Button
            isSelected={settings.preferences.restrictionGroup === restrictionGroup.name}
            onClick={() => {
              const isSet = preferences.restrictionGroup === restrictionGroup.name;
              updatePreference(settings, 'restrictionGroup', isSet ? '' : restrictionGroup.name);
            }}
            content={intl.formatMessage({ id: 'enable' })}
          />
        </>
      )}
      {addMode && (
        <Button
          onClick={() => addAlbumToRestrictedList(album, restrictionGroup)}
          content={intl.formatMessage({ id: 'add' })}
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
      {isDeleteOpen && (
        <Confirm
          onConfirm={() => onDeleteRestrictionGroup()}
          onCancel={() => {
            setIsDeleteOpen(false);
            setSelectedRestrictionMode(null);
          }}
          text={intl.formatMessage({ id: 'delete_restriction_group_text' })}
        />
      )}
      {restrictionGroups?.length === 0 && !isAddOpen && !isDeleteOpen && (
        <NoResults
          applyMargin={false}
          className="fullWidth"
          title={intl.formatMessage({ id: 'no_restriction_groups_title' })}
          text={intl.formatMessage({ id: 'no_restriction_groups_text' })}
          controls={(
            <>
              <Button content={intl.formatMessage({ id: 'add' })} onClick={() => setIsAddOpen(true)} />
            </>
          )}
        />
      )}
      {selectedRestrictionMode && !isDeleteOpen && (
        <RestrictionModeDetail
          onClose={() => setSelectedRestrictionMode(null)}
          restrictionMode={selectedRestrictionMode}
        />
      )}
      {!selectedRestrictionMode && isAddOpen && !isDeleteOpen && (
        <AddNew
          title={intl.formatMessage({ id: 'add_restriction_group' })}
          dropdowns={[{ name: intl.formatMessage({ id: 'group_type' }), options: ['whitelist', 'blacklist'], value: 'whitelist' }]}
          onConfirm={onAddRestrictionGroup}
          onCancel={() => setIsAddOpen(false)}
        />
      )}
      {!selectedRestrictionMode && !isAddOpen && !isDeleteOpen && restrictionGroups?.length > 0 && (
        <PaginatedList
          topLevelControls={<Button content={intl.formatMessage({ id: 'add' })} onClick={() => setIsAddOpen(true)} />}
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

export default injectIntl(RestrictionModes);
