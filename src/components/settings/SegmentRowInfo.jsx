import React, { useContext } from 'react';
import Button from '../Button';

import { createSegment, removeSegment } from '../../lib/lighting-client';
import Item from '../common/Item';
import { SettingsContext } from '../layout/SettingsProvider';

const SegmentRowInfo = ({ segment, controller, skin, event, onConfigure, isOnController }) => {
  const settings = useContext(SettingsContext);
  const controllerMetadata = settings.controllers?.find((c) => c.ip === controller.info?.ip || controller.ip);
  const segmentMetadata = controllerMetadata?.segments.find((s) => s.start === segment.start.toString() && s.stop === segment.stop.toString());

  const pushSegment = async (data) => {
    await createSegment(controller.info.ip, data.start, data.stop);
    window.location.reload();
  };

  const removeRemoteSegment = async (data) => {
    await removeSegment(controller.info.ip, data.start, data.stop);
    window.location.reload();
  };

  let effectName;
  if (skin) {
    const skinController = skin.lighting?.controllers.find((c) => c.ip === (controller.info?.ip || controller.ip));
    const eventSegments = skinController?.segments.filter((s) => s.event === event);
    const skinSegment = eventSegments?.find((s) => s.start.toString() === segment.start.toString() && s.stop.toString() === segment.stop.toString())
    effectName = skinSegment?.effect;
  }

  const effectText = effectName ? `effect: ${effectName}` : '';
  const nameText = segmentMetadata?.name ? `name: ${segmentMetadata?.name} - ` : '';

  return (
    <Item
      text={`${nameText}Start: ${segment.start} Stop: ${segment.stop} ${effectText}`}
      buttons={
        <>
          <Button content="Configure" onClick={() => onConfigure(segment)} />
          {!isOnController && <Button content="Push to Controller" onClick={() => pushSegment(segment) } />}
          {isOnController && !onConfigure && <Button content="Remove from Controller" onClick={() => removeRemoteSegment(segment)} />}
        </>
      }
    />
  )
};

export default SegmentRowInfo;