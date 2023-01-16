import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';

import LightingControllers from '../LightingControllers';
import SkinSegmentConfiguration from './SkinSegmentConfiguration';
import { Skin } from '../../shapes';
import { Container } from 'react-bootstrap';
import FullWidthRow from '../../common/FullWidthRow';
import Button from '../../Button';

const propTypes = {
  skin: Skin.isRequired,
  loadSkins: PropTypes.func.isRequired,
};

const SkinLights = ({ skin, onClose, loadSkins }) => {
  const [selectedController, setSelectedController] = useState();

  const onConfigure = (controller) => {
    setSelectedController(controller);
  };

  return (
    <Container fluid>
      <Row>
        <Button content="Back to Skin" onClick={onClose} />
      </Row>
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
    </Container>
  );
};

SkinLights.propTypes = propTypes;

export default SkinLights;
