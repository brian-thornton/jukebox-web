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
import Presets from '../Presets';
import { deleteSkin, createSkin } from '../../../lib/style-client';

const propTypes = {
  controller: Controller.isRequired,
  skin: Skin.isRequired,
};

const SkinSegmentConfiguration = ({ skin, controller, loadSkins }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  useEffect(() => setItemsPerPage(pageSize('item', 250)), []);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  const lightingEvents = ['Albums', 'Category', 'Tracks', 'Playlists',
    'Queue', 'Settings', 'Delete', 'Enqueue', 'Loading', 'Search', 'Lock'];

  const setSkinEventPreset = (preset) => {
    const deepClone = JSON.parse(JSON.stringify(skin));

    if (!deepClone.lighting) {
      // Lighting has never been defined for the skin. We need define it here.
      console.log('bad');
      deepClone.lighting = {
        controllers: [
          {
            ip: controller.ip,
            events: [
              {
                event: selectedEvent,
                preset: preset.n,
              }
            ]
          }
        ]
      }
    } else {
      // The skin has lighting defined. We need to search for configuration for the current controller.
      const existingController = deepClone.lighting.controllers.find(c => c.ip === controller.ip);

      // If the controller exists, we need to check if the current event is already defined and update it.
      if (existingController) {
        const existingEvent = existingController.events.find(e => e.event === selectedEvent);
        console.log(selectedEvent);
        console.log(existingEvent);

        // An existing event was found. Let's update it.
        if (existingEvent) {
          // An existing event was found. Let's update it.
          console.log('place 1');
          existingEvent.preset = preset.n;
        } else {
          // This event does not yet exist. Let's add it.
          console.log('place 2');
          existingController.events.push({
            event: selectedEvent,
            preset: preset.n,
          });
        }
      } else {
        // This is the first time we are seeing this controller. Let's add the entry and initial event.
        console.log('place 3');
        deepClone.lighting.controllers.push(
          {
            ip: controller.ip,
            events: [
              {
                event: selectedEvent,
                preset: preset.n,
              }
            ]
          }
        );
      }
    }

    console.log(deepClone);

    deleteSkin(deepClone.name).then(() => {
      createSkin({
        name: deepClone.name,
        skin: deepClone,
      }).then(() =>  window.location.replace(`/settings?skin=${deepClone.name}&mode=style&tab=lights`))
    });
  };

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
        <Presets
          controller={controller}
          onClose={() => setIsDetailOpen(false)}
          onSelect={setSkinEventPreset}
        />
      )}
    </>
  );
};

SkinSegmentConfiguration.propTypes = propTypes;

export default SkinSegmentConfiguration;
