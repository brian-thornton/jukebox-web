import ListGroup from 'react-bootstrap/ListGroup';
import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

import Button from '../../Button';
import Item from '../../common/Item';
import './SkinSegmentConfiguration.scss';
import Paginator from '../../common/Paginator';
import SkinSegmentDetail from './SkinSegmentDetail';
import { pageSize } from '../../../lib/styleHelper';
import { handlers } from '../../../lib/gesture-helper';
import { Controller, Skin } from '../../shapes';

const propTypes = {
  controller: Controller.isRequired,
  skin: Skin.isRequired,
};

const SkinSegmentConfiguration = ({ skin, controller }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  useEffect(() => setItemsPerPage(pageSize('item', 250)), []);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  const lightingEvents = ['Albums', 'Category', 'Tracks', 'Playlists',
    'Queue', 'Settings', 'Delete', 'Enqueue', 'Loading', 'Search', 'Lock'];

  const eventRow = event => (
    <Item
      text={event}
      buttons={(
        <>
          <Button
            className="skin-segment-configure-button"
            onClick={() => {
              setSelectedEvent(event);
              setIsDetailOpen(true);
            }}
            content="Configure"
          />
        </>
      )}
    />
  );

  return (
    <>
      {!isDetailOpen && (
        <>
          <ListGroup className="styleEditorContent" {...swipe}>
            {lightingEvents.slice(start, (start + itemsPerPage)).map(le => eventRow(le))}
          </ListGroup>
          <Paginator
            disableRandom
            onPageChange={page => setSelectedPage(page)}
            selectedPage={selectedPage}
            totalItems={lightingEvents.length}
            pageSize={itemsPerPage}
          />
        </>
      )}
      {isDetailOpen && (
        <SkinSegmentDetail
          skin={skin}
          event={selectedEvent}
          controller={controller}
          onCancel={() => setIsDetailOpen(false)}
        />
      )}
    </>
  );
};

SkinSegmentConfiguration.propTypes = propTypes;

export default SkinSegmentConfiguration;
