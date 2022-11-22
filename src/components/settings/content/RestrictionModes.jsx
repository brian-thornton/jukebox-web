import { Container, Row } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useEffect, useState } from 'react';
import {
  PencilSquare,
  Search,
  Trash,
} from 'react-bootstrap-icons';

import AddNew from '../../common/AddNew';
import Button from '../../Button';
import Paginator from '../../common/Paginator';
import { useSwipeable } from 'react-swipeable';
import { handlers } from '../../../lib/gesture-helper';
import { pageSize } from '../../../lib/styleHelper';
import Item from '../../common/Item';
import { createRestrictionGroup, getRestrictionGroups, updateRestrictionGroup } from '../../../lib/settings-client';

const RestrictionModes = ({ addMode, addComplete, album }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [isAddOpen, setIsAddOpen] = useState();
  const [selectedRestrictionMode, setSelectedRestrictionMode] = useState();
  const restrictionModes = ['Unrestricted', 'Kids Party', 'Mixed Company'];
  const [restrictionGroups, setRestrictionGroups] = useState();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  const loadRestrictionGroups = async () => {
    const data = await getRestrictionGroups();
    setRestrictionGroups(data);
  };

  useEffect(() => {
    setRealPageSize(pageSize('item', 300));
    loadRestrictionGroups();
  }, []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

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

  return (
    <>
      {isAddOpen && (
        <AddNew
          title="Add Restriction Group"
          onConfirm={onAddRestrictionGroup}
          onCancel={() => setIsAddOpen(false)}
        />
      )}
      {!isAddOpen && restrictionGroups?.length > 0 && (
        <Container fluid style={{ width: '100%' }}>
          <Row>
            <Button content="Add" onClick={() => setIsAddOpen(true)} />
          </Row>
          <Row>
            <ListGroup {...swipe} style={{ width: '100%' }}>
              {restrictionGroups.slice(realStart, (realStart + realPageSize)).map((restrictionGroup) => (
                <Item
                  text={`${restrictionGroup.name} (${restrictionGroup.type})`}
                  buttons={(
                    <>
                      {!addMode && (
                        <Button
                          onClick={() => setSelectedRestrictionMode(restrictionGroup)}
                          content={<PencilSquare />}
                        />
                      )}
                      {addMode && (
                        <Button
                          onClick={() => addAlbumToRestrictedList(album, restrictionGroup)}
                          content="Add"
                        />
                      )}
                    </>
                  )}
                />
              )
              )}
            </ListGroup>
          </Row>
          <Row>
            <Paginator
              disableRandom
              onPageChange={(page) => setSelectedPage(page)}
              selectedPage={selectedPage}
              totalItems={restrictionModes.length}
              pageSize={realPageSize}
            />
          </Row>
        </Container>
      )}
    </>
  );
}

export default RestrictionModes;
