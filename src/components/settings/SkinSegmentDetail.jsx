import React, { useContext, useEffect, useState } from 'react';

import { SettingsContext } from '../layout/SettingsProvider';
import Button from '../Button';
import { getCurrentState } from '../../lib/lighting-client';
import Segments from './Segments';
import SegmentColorSelection from './SegmentColorSelection';

const SkinSegmentDetail = ({ controller, skin, event, onCancel, onSave }) => {
  const settings = useContext(SettingsContext);
  const [controllerState, setControllerState] = useState();
  const [configSegment, setConfigSegment] = useState();

  const loadState = async () => {
    getCurrentState(controller.ip).then(data => setControllerState(data));
  };

  const initState = () => loadState();

  useEffect(() => {
    if (!controllerState) {
      initState();
    }
  }, []);

  return (
    <>
      {!configSegment && controllerState?.state && (
        <Segments
          skin={skin}
          event={event}
          controller={controller}
          segments={controllerState.state.seg}
          allowAdd={false}
          allowRemove={false}
          onConfigure={(segment) => {
            setConfigSegment(segment)
          }}
        />
      )}
      {`Skin Lighting for controller ${controller.ip} segment ${configSegment?.id} during event ${event}`}
      {configSegment && (
        <SegmentColorSelection
          event={event}
          controller={controller}
          skin={skin}
          segment={configSegment}
          onSaveComplete={() => setConfigSegment(null)}
        />
      )}
      <Button
        style={{ float: 'right', width: '100px' }}
        onClick={() => onCancel(null)}
        content="Done"
      />
    </>
  );
};

export default SkinSegmentDetail;