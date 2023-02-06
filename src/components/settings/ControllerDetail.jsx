import Card from 'react-bootstrap/Card';
import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { getCurrentState } from '../../lib/lighting-client';
import { SettingsContext } from '../layout/SettingsProvider';
import { Segments } from './Segments';
import './ControllerDetail.scss';
import { Controller } from '../shapes';

const propTypes = {
  controller: Controller.isRequired,
};

const ControllerDetail = ({ controller }) => {
  const settings = useContext(SettingsContext);
  const [controllerState, setControllerState] = useState();

  const loadState = async () => {
    getCurrentState(controller.ip).then((data) => {
      setControllerState(data);
    });
  };

  const initState = () => loadState();

  useEffect(initState, []);

  return (
    <>
      <Card className="controller-card">
        <Card.Title className="controller-card-title" style={{ color: settings.styles.fontColor }}>
          <FormattedMessage id="segments_for_ip" values={{ ip: controller.ip }} />
        </Card.Title>
        <Card.Body>
          {controllerState?.state && (
            <Segments
              controller={controllerState}
              segments={controllerState.state.seg}
            />
          )}
        </Card.Body>
      </Card>
    </>
  );
};

ControllerDetail.propTypes = propTypes;

export default ControllerDetail;
