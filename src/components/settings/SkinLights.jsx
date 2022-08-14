import React, { useState } from 'react';

import Button from '../Button';
import LightingControllers from './LightingControllers';
import SkinSegmentConfiguration from './SkinSegmentConfiguration';

const SkinLights = ({ skin }) => {
  const [selectedController, setSelectedController] = useState();

  const onConfigure = (controller) => {
    setSelectedController(controller);
  };

  return (
    <>
      {!selectedController && (
      <LightingControllers
        allowAdd={false}
        allowRemove={false}
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