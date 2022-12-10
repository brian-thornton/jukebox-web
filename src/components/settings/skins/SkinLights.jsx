import React, { useState } from 'react';

import LightingControllers from '../LightingControllers';
import SkinSegmentConfiguration from './SkinSegmentConfiguration';
import { Skin } from '../../shapes';

const propTypes = {
  skin: Skin.isRequired,
};

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
      {selectedController && (
        <SkinSegmentConfiguration
          controller={selectedController}
          skin={skin}
        />
      )}
    </>
  );
};

SkinLights.propTypes = propTypes;

export default SkinLights;
