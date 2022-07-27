import Card from 'react-bootstrap/Card';
import React, { useContext, useEffect, useState } from 'react';

import { getCurrentState } from '../../lib/lighting-client';
import { SettingsContext } from '../layout/SettingsProvider';
import { updateSettings } from '../../lib/settings-client';
import Segments from './Segments';

const ControllerDetail = ({ controller }) => {
  const settings = useContext(SettingsContext);
  const [controllerState, setControllerState] = useState();

  const updateSettingsToMatchController = async (data) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const updatedController = deepClone.controllers?.find((c) => c.ip === controller.ip);
    let saveUpdate = false;

    const segmentsMissingFromSettings = [];

    data.state.seg.map((s) => {
      if (!updatedController.segments.find((q) => q.start.toString() === s.start.toString() && q.stop.toString() === s.stop.toString())) {
        saveUpdate = true;
        updatedController.segments.push(
          {
            start: s.start.toString(),
            stop: s.stop.toString(),
            name: '',
          }
        );
      }
    })

    if (saveUpdate) {
      updateSettings(deepClone);
    }
  };


  const loadState = async () => {
    getCurrentState(controller.ip).then(data => {
      setControllerState(data)
      updateSettingsToMatchController(data);
      // Update controller in master settings here.


    });
  };

  const initState = () => loadState();

  useEffect(initState, []);

  return (
    <>
      <Card style={{ width: '100%', background: 'transparent' }}>
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