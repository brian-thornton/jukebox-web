import { FC, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import LightingControllers from '../../LightingControllers';
import SkinSegmentConfiguration from '../SkinSegmentConfiguration/SkinSegmentConfiguration';
import { ISkin } from '../../../interface';
import Button from '../../../Button';

interface ISkinLights {
  onClose: Function,
  skin: ISkin,
  loadSkins: Function,
}

const SkinLights: FC<ISkinLights> = ({ skin, onClose, loadSkins }) => {
  const [selectedController, setSelectedController] = useState();

  const onConfigure = (controller: any) => {
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
          // @ts-ignore
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

export default SkinLights;
