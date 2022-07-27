import React, { useState } from 'react';

import Button from '../Button';
import LightingControllers from './LightingControllers';
import SkinSegmentConfiguration from './SkinSegmentConfiguration';
import { powerOff, powerOn, setEffect } from '../../lib/lighting-client';

const SkinLights = ({ skin }) => {
  const [selectedController, setSelectedController] = useState();

  const buttons = [
    <Button
      style={{ float: 'right', width: '100px' }}
      onClick={() => {
      }}
      content="Enabled"
    />
  ]

  const onConfigure = (controller) => {
    setSelectedController(controller);
  };

  return (
    <>
      {!selectedController && (
      <LightingControllers
        allowAdd={false}
        allowRemove={false}
        buttons={buttons}
        skin={skin}
        onConfigure={onConfigure}
        allowName={false}
      />
      )}
      {selectedController && <SkinSegmentConfiguration controller={selectedController} skin={skin} />}
    </>
  );
};

export default SkinLights;