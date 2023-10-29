import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import { createSegment, removeSegment } from '../../lib/service-clients/lighting-client';
import Item from '../common/Item/Item';
import { SettingsContext } from '../layout/SettingsProvider';
import {
  Event,
  LightingController,
  Segment,
  Skin,
} from '../shapes';

const propTypes = {
  segment: Segment.isRequired,
  controller: LightingController.isRequired,
  skin: Skin,
  event: Event,
  onConfigure: PropTypes.func.isRequired,
  isOnController: PropTypes.bool,
};

const SegmentRowInfo = ({
  segment,
  controller,
  skin,
  event,
  onConfigure,
  isOnController,
}) => {
  const settings = useContext(SettingsContext);
  const controllerMetadata = settings.controllers?.find(c => (
    c.ip === controller.info?.ip || controller.ip));
  const segmentMetadata = controllerMetadata?.segments.find(s => (
    s.start === segment.start.toString() && s.stop === segment.stop.toString()));

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
    const skinController = skin.lighting?.controllers.find(c => (
      c.ip === (controller.info?.ip || controller.ip)));
    const eventSegments = skinController?.segments.filter(s => s.event === event);
    const skinSegment = eventSegments?.find(s => s.start.toString() === segment.start.toString()
      && s.stop.toString() === segment.stop.toString());
    effectName = skinSegment?.effect;
  }

  const effectText = effectName ? <FormattedMessage id="effect_with_name" values={{ name: effectName }} /> : '';
  const nameText = segmentMetadata?.name ? <FormattedMessage id="speed_with_name" values={{ name: segmentMetadata?.name }} /> : '';

  return (
    <Item
      text={(
        <FormattedMessage
          id="segment_start_stop"
          values={{
            name: nameText,
            start: segment.start,
            stop: segment.stop,
            effect: effectText,
          }} />
      )}
      buttons={(
        <>
          <Button content={<FormattedMessage id="configure" />} onClick={() => onConfigure(segment)} />
          {!isOnController && <Button content={<FormattedMessage id="push_to_controller" />} onClick={() => pushSegment(segment)} />}
          {isOnController && !onConfigure && <Button content={<FormattedMessage id="remove_from_controller" />} onClick={() => removeRemoteSegment(segment)} />}
        </>
      )}
    />
  );
};

SegmentRowInfo.defaultProps = {
  skin: null,
  event: null,
  isOnController: false,
};

SegmentRowInfo.propTypes = propTypes;

export default SegmentRowInfo;
