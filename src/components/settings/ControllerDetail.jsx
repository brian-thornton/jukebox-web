import Card from 'react-bootstrap/Card';
import React, { useContext, useEffect, useState } from 'react';

import { getCurrentState } from '../../lib/lighting-client';
import { SettingsContext } from '../layout/SettingsProvider';
import { updateSettings } from '../../lib/settings-client';
import Segments from './Segments';
import './ControllerDetail.scss';

const ControllerDetail = ({ controller }) => {
  const settings = useContext(SettingsContext);
  const [controllerState, setControllerState] = useState();


  const loadState = async () => {
    getCurrentState(controller.ip).then(data => {
      setControllerState(data)
    });
  };

  const initState = () => loadState();

  useEffect(initState, []);

  return (
    <>
      <Card className="controller-card">
        <Card.Title style={{ marginTop: '5px', color: settings.styles.fontColor }}>
          Segments for IP: {controller.ip}
        </Card.Title>
        <Card.Body>
          {controllerState?.state && <Segments controller={controllerState} segments={controllerState.state.seg} />}
        </Card.Body>
      </Card>
    </>
  );
};

export default ControllerDetail;