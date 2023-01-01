import React, { useState } from 'react';
import PropTypes from 'prop-types';

import LightingControllers from '../LightingControllers';
import SkinSegmentConfiguration from './SkinSegmentConfiguration';
import { Skin } from '../../shapes';

const propTypes = {
  skin: Skin.isRequired,
  loadSkins: PropTypes.func.isRequired,
};

const SkinLights = ({ skin, loadSkins }) => {
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
          setController={setSelectedController}
          controller={selectedController}
          skin={skin}
          loadSkins={loadSkins}
        />
      )}
    </>
  );
};

SkinLights.propTypes = propTypes;

export default SkinLights;
