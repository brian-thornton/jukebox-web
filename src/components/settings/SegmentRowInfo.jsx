import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { injectIntl } from 'react-intl';

import Button from '../Button';
import { createSegment, removeSegment } from '../../lib/lighting-client';
import Item from '../common/Item';
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
  intl,
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

  const effectText = effectName ? `${intl.formatMessage({ id: 'effect' })}: ${effectName}` : '';
  const nameText = segmentMetadata?.name ? `${intl.formatMessage({ id: 'speed' })}: ${segmentMetadata?.name} - ` : '';

  return (
    <Item
      text={`${nameText}${intl.formatMessage({ id: 'start' })}: ${segment.start} ${intl.formatMessage({ id: 'stop' })}: ${segment.stop} ${effectText}`}
      buttons={(
        <>
          <Button content={intl.formatMessage({ id: 'configure' })} onClick={() => onConfigure(segment)} />
          {!isOnController && <Button content={intl.formatMessage({ id: 'push_to_controller' })} onClick={() => pushSegment(segment)} />}
          {isOnController && !onConfigure && <Button content={intl.formatMessage({ id: 'remove_from_controller' })} onClick={() => removeRemoteSegment(segment)} />}
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

export default injectIntl(SegmentRowInfo);
