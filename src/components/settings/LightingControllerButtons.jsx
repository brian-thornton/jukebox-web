import { TrashFill, PencilSquare } from 'react-bootstrap-icons';
import React, { useContext, useEffect, useState } from 'react';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import { updateSettings } from '../../lib/settings-client';
import './LightingControllers.scss';
import { createSegment, reset } from '../../lib/lighting-client';
import CloneController from './CloneController';

const LightingControllerButtons = ({ allowAdd = true, allowName = true, allowRemove = true, allowConfigure = true, buttons, skin, onConfigure = () => { } }) => {
  const settings = useContext(SettingsContext);
  const [networkControllers, setNetworkControllers] = useState();
  const [updatedControllerName, setsUpdateControllerName] = useState();
  const [cloneSource, setCloneSource] = useState();

  const saveSettings = (updatedSettings, preventReload) => {
    updateSettings(updatedSettings).then(() => {
      if (!preventReload) {
        window.location.reload();
      }
    });
  };

  const onControllerRemove = (ip) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.controllers = deepClone.controllers.filter((f) => f.ip !== ip);

    saveSettings(deepClone);
  };

  const onSetName = async (controller) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const updatedController = deepClone.controllers?.find((c) => c.ip === controller.ip);

    if (!updatedController) {
      //
    } else {
      updatedController.name = updatedControllerName;
    }

    saveSettings(deepClone);
  };

  const pushSegmentsFromMetadata = async (controller) => {
    console.log(controller);
    if (controller.segments) {
      for (const segment of controller.segments) {
        await createSegment(controller.ip, segment.start, segment.stop);
      }
    }
  };

  return (
    <>
      {!skin && controller.ip === cloneSource?.ip && (
        <CloneController cloneSource={cloneSource} setCloneSource={setCloneSource} networkControllers={networkControllers} />
      )}
      {controller.ip !== cloneSource?.ip && (
        <>
          {allowRemove && (
            <Button
              className="lighting-controller-button"
              onClick={() => onControllerRemove(controller.ip)}
              icon={<TrashFill />}
            />
          )}
          {allowConfigure && (
            <>
              <Button
                disabled={!controller.online}
                className="lighting-controller-button"
                onClick={() => {
                  setIsConfigureOpen(true);
                  setSelectedController(controller);
                  onConfigure(controller);
                }}
                icon={<PencilSquare />}
              />
              {!skin && (
                <Button
                  className="lighting-controller-button"
                  onClick={() => {
                    setCloneSource(controller);
                  }}
                  content="Clone"
                />
              )}
              {!skin && (
                <Button
                  disabled={!controller.online}
                  className="lighting-controller-button"
                  onClick={() => {
                    onSetName(controller);
                  }}
                  content="Save"
                />
              )}
              {!skin && (
                <Button
                  disabled={!controller.online}
                  className="lighting-controller-button"
                  onClick={() => {
                    pushSegmentsFromMetadata(controller);
                  }}
                  content="Push Segments"
                />
              )}
              {!skin && (
                <Button
                  disabled={!controller.online}
                  className="lighting-controller-button"
                  onClick={() => {
                    reset(controller.ip);
                  }}
                  content="Reset"
                />
              )}
            </>
          )}
        </>
      )}
      {/* {buttons?.length && buttons.map((b) => b)} */}
    </>
  );
};

export default LightingControllerButtons;