import { FC, useContext, useEffect, useState } from 'react';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { FormattedMessage, useIntl } from 'react-intl';

import AddNew from '../../../common/AddNew/AddNew';
import Button from '../../../Button';
import { calculatePageSize } from '../../../../lib/helper/styleHelper';
import RestrictionModeDetail from '../RestrictionModeDetail/RestrictionModeDetail';
import { SettingsContext } from '../../../layout/SettingsProvider';
import {
  createRestrictionGroup,
  deleteRestrictionGroup,
  getRestrictionGroups,
  updateRestrictionGroup,
} from '../../../../lib/service-clients/settings-client';
import { updatePreference } from '../../../../lib/helper/preferenceHelper';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import { IAlbum, IRestrictionMode } from '../../../interface';
import NoResults from '../../../common/NoResults/NoResults';
import Confirm from '../../../common/Confirm/Confirm';
import RestrictionActions from '../RestrictionActions/RestrictionActions';

interface IRestrictionModes {
  addMode?: boolean,
  addComplete?: Function,
  album?: IAlbum,
}

const RestrictionModes: FC<IRestrictionModes> = ({ addMode, addComplete, album }) => {
  const settings = useContext(SettingsContext);
  const intl = useIntl();
  const { preferences, screen } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRestrictionMode, setSelectedRestrictionMode] = useState<IRestrictionMode | undefined>(undefined);
  const [restrictionGroups, setRestrictionGroups] = useState([]);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  const loadRestrictionGroups = async () => {
    const data = await getRestrictionGroups();
    setRestrictionGroups(data);
  };

  useEffect(() => {
    setRealPageSize(calculatePageSize('item', 300));
    loadRestrictionGroups();
  }, []);

  const addAlbumToRestrictedList = (restrictAlbum: any, restrictionGroup: any) => {
    if (!restrictionGroup.content.includes(restrictAlbum.path)) {
      restrictionGroup.content.push(restrictAlbum.path);
      updateRestrictionGroup(restrictionGroup);
    }

    if (addComplete) {
      addComplete();
    }
  };

  const onAddRestrictionGroup = async (group: any, dropdowns: any) => {
    await createRestrictionGroup({
      name: group.name,
      type: dropdowns[0].value,
      content: [],
    });


    await loadRestrictionGroups();
    // @ts-ignore
    setIsAddOpen(false);
  };

  const onDeleteRestrictionGroup = async () => {
    await deleteRestrictionGroup({ name: selectedRestrictionMode?.name });
    setIsDeleteOpen(false);
    setSelectedRestrictionMode(undefined);
    loadRestrictionGroups();
  };

  const itemButtons = (restrictionGroup: IRestrictionMode) => (
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
              setIsDeleteOpen(true);
            }}
            content={<Trash />}
          />
          <Button
            isSelected={settings?.preferences?.restrictionGroup === restrictionGroup.name}
            onClick={() => {
              const isSet = preferences?.restrictionGroup === restrictionGroup.name;
              updatePreference(settings, 'restrictionGroup', isSet ? '' : restrictionGroup.name);
            }}
            content={<FormattedMessage id="enable" />}
          />
        </>
      )}
      {addMode && (
        <Button
          onClick={() => addAlbumToRestrictedList(album, restrictionGroup)}
          content={<FormattedMessage id="add" />}
        />
      )}
    </>
  );

  const items = () => (
    // @ts-ignore
    restrictionGroups.slice(realStart, (realStart + realPageSize)).map((restrictionGroup: any) => (
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
            setSelectedRestrictionMode(undefined);
          }}
          text={intl.formatMessage({id: "delete_restriction_group_text"})}
        />
      )}
      {restrictionGroups?.length === 0 && !isAddOpen && !isDeleteOpen && (
        <NoResults
          applyMargin={false}
          title={intl.formatMessage({id: "no_restriction_groups_title"})}
          text={intl.formatMessage({id: "no_restriction_groups_title"})}
          controls={(
            <>
              <Button content={<FormattedMessage id="add" />} onClick={() => setIsAddOpen(true)} />
            </>
          )}
        />
      )}
      {selectedRestrictionMode && !isDeleteOpen && !screen?.isMobile && (
        <RestrictionModeDetail
          onClose={() => setSelectedRestrictionMode(undefined)}
          restrictionMode={selectedRestrictionMode}
        />
      )}
      {selectedRestrictionMode && !isDeleteOpen && screen?.isMobile && (
        <RestrictionActions
          onClose={() => setSelectedRestrictionMode(undefined)}
        />
      )}
      {!selectedRestrictionMode && isAddOpen && !isDeleteOpen && (
        <AddNew
          title={intl.formatMessage({id: "add_restriction_group"})}
          dropdowns={[{ name: <FormattedMessage id="group_type" />, options: ['whitelist', 'blacklist'], value: 'whitelist' }]}
          onConfirm={onAddRestrictionGroup}
          confirmText='Add'
          cancelText='Cancel'
          onCancel={() => setIsAddOpen(false)}
          fields={{ name: 'Name' }}
        />
      )}
      {!selectedRestrictionMode && !isAddOpen && !isDeleteOpen && restrictionGroups?.length > 0 && (
        <PaginatedList
          topLevelControls={album ? <></> : <Button content={<FormattedMessage id="add" />} onClick={() => setIsAddOpen(true)} />}
          items={items()}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={realPageSize}
          applyTopMargin={album ? true : false}
          onItemClick={() => { }}
        />
      )}
    </>
  );
};

export default RestrictionModes;
