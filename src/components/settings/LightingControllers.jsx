import {
  TrashFill,
  PencilSquare,
  PlusSquare,
  Power,
} from 'react-bootstrap-icons';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useContext, useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './LightingControllers.scss';
import {
  discover,
  createSegment,
  reset,
  powerOff,
} from '../../lib/lighting-client';
import { SettingsContext } from '../layout/SettingsProvider';
import { updateSettings } from '../../lib/settings-client';
import AddNew from '../common/AddNew';
import Button from '../Button';
import CloneController from './CloneController';
import ControllerDetail from './ControllerDetail';
import Item from '../common/Item';
import Loading from '../common/Loading';
import NameInput from '../common/NameInput';
import Presets from './Presets';
import { Skin } from '../shapes';
import FullWidthRow from '../common/FullWidthRow';

const propTypes = {
  allowAdd: PropTypes.bool,
  allowName: PropTypes.bool,
  allowRemove: PropTypes.bool,
  allowConfigure: PropTypes.bool,
  buttons: PropTypes.arrayOf(PropTypes.node),
  skin: Skin,
  onConfigure: PropTypes.func,
};

export const LightingControllers = ({
  allowAdd = true,
  allowName = true,
  allowRemove = true,
  allowConfigure = true,
  buttons,
  skin,
  onConfigure = () => { },
}) => {
  const settings = useContext(SettingsContext);
  const { preferences } = settings;
  const { experimentalMode } = preferences;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [selectedController, setSelectedController] = useState();
  const [discoveryInProgress, setDiscoveryInProgress] = useState(false);
  const [networkControllers, setNetworkControllers] = useState();
  const [updatedControllerName, setsUpdateControllerName] = useState();
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [cloneSource, setCloneSource] = useState();

  const discoverControllers = () => {
    setDiscoveryInProgress(true);
    discover().then((data) => {
      data.forEach((c) => {
        const metaData = settings?.controllers?.find(m => m.ip === c.ip);

        if (metaData) {
          c.segments = metaData.segments;
        }
      });

      const deepClone = JSON.parse(JSON.stringify(settings));

      if (deepClone.controllers) {
        deepClone.controllers.forEach((controller) => {
          const onlineController = data.find(c => c.ip === controller.ip);
          if (onlineController) {
            controller.online = true;
          } else {
            controller.online = false;
          }
        });

        data.forEach((c) => {
          const knownController = deepClone.controllers?.find(kc => c.ip === kc.ip);
          if (!knownController) {
            deepClone.controllers.push({ ...c, online: true });
          }
        });
      } else {
        deepClone.controllers = data;
      }

      updateSettings(deepClone, true);

      setNetworkControllers(data);
      setDiscoveryInProgress(false);
    });
  };

  useEffect(() => {
    if (!skin) {
      if (settings && !settings.controllers) {
        discoverControllers();
      }
    }
  }, []);

  const saveSettings = (updatedSettings, preventReload) => {
    updateSettings(updatedSettings).then(() => {
      if (!preventReload) {
        window.location.reload();
      }
    });
  };

  const onControllerAdd = async (name, ip) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const controllerToAdd = { name, ip };

    if (deepClone.controllers) {
      if (!deepClone.controllers.find(c => c.ip === ip)) {
        deepClone.controllers.push(controllerToAdd);
      }
    } else {
      deepClone.controllers = [controllerToAdd];
    }

    saveSettings(deepClone);
  };

  const onControllerRemove = (ip) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.controllers = deepClone.controllers.filter(f => f.ip !== ip);
    saveSettings(deepClone);
  };

  const onSetName = async (controller) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const updatedController = deepClone.controllers?.find(c => c.ip === controller.ip);

    if (!updatedController) {
      if (!deepClone.controllers) {
        deepClone.controllers = [
          {
            name: controller.name,
            ip: controller.ip,
            segments: [],
          },
        ];
      }
    } else {
      updatedController.name = updatedControllerName;
    }

    saveSettings(deepClone);
  };

  const pushSegmentsFromMetadata = async (controller) => {
    if (controller.segments) {
      for (const segment of controller.segments) {
        await createSegment(controller.ip, segment.start, segment.stop);
      }
    }
  };

  const buttonProps = (controller) => ({
    disabled: !controller.online,
    className: "lighting-controller-button",
  });

  const controllerRow = (controller) => {
    const { online } = controller;

    return (
      <Item
        text={(
          <Container fluid>
            <Row>
              <Col>
                {`${controller.ip} (${online ? 'Online' : 'Offline'})`}
                {!allowName && <div>{controller.name}</div>}
              </Col>
              <Col>
                {allowName && (
                  <NameInput
                    defaultValue={controller.name}
                    onChange={event => setsUpdateControllerName(event.target.value)}
                  />
                )}
              </Col>
            </Row>
          </Container>
        )}
        buttons={(
          <>
            {!skin && controller.ip === cloneSource?.ip && (
              <CloneController
                cloneSource={cloneSource}
                setCloneSource={setCloneSource}
                networkControllers={networkControllers}
              />
            )}
            {controller.ip !== cloneSource?.ip && (
              <>
                {allowRemove && experimentalMode && (
                  <Button
                    className="lighting-controller-button"
                    onClick={() => onControllerRemove(controller.ip)}
                    icon={<TrashFill />}
                  />
                )}
                {allowConfigure && (
                  <>
                    {experimentalMode && (
                      <Button
                        {...buttonProps(controller)}
                        onClick={() => {
                          setIsConfigureOpen(true);
                          setSelectedController(controller);
                          onConfigure(controller);
                        }}
                        icon={<PencilSquare />}
                      />
                    )}
                    {!skin && (
                      <>
                        {experimentalMode && (
                          <>
                            <Button
                              className="lighting-controller-button"
                              onClick={() => {
                                setCloneSource(controller);
                              }}
                              content={<FormattedMessage id="clone" />}
                            />
                            <Button
                              {...buttonProps(controller)}
                              onClick={() => {
                                onSetName(controller);
                              }}
                              content={<FormattedMessage id="save" />}
                            />
                            <Button
                              {...buttonProps(controller)}
                              onClick={() => {
                                pushSegmentsFromMetadata(controller);
                              }}
                              content={<FormattedMessage id="push_segments" />}
                            />
                          </>
                        )}
                        <Button
                          {...buttonProps(controller)}
                          onClick={() => {
                            powerOff(controller.ip);
                          }}
                          content={<Power />}
                        />
                        <Button
                          {...buttonProps(controller)}
                          onClick={() => {
                            setIsPresetsOpen(true);
                            setSelectedController(controller);
                          }}
                          content={<FormattedMessage id="presets" />}
                        />
                        {experimentalMode && (
                          <Button
                            {...buttonProps(controller)}
                            onClick={() => {
                              reset(controller.ip);
                            }}
                            content={<FormattedMessage id="reset" />}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {buttons?.length && buttons.map(b => b)}
          </>
        )}
      />
    );
  };

  return (
    <>
      {!isPresetsOpen && !isConfigureOpen && !isAddOpen && (
        <>
          {allowAdd && (
            <>
              <Button
                onClick={() => {
                  setIsAddOpen(true);
                }}
                icon={<PlusSquare />}
              />
              <Button
                onClick={() => {
                  discoverControllers();
                }}
                content={<FormattedMessage id="discover" />}
              />
            </>
          )}
          <Container fluid className="styleEditorContent">
            <FullWidthRow>
              {!discoveryInProgress && (
                <Row>
                  <ListGroup className="styleEditorContent">
                    {networkControllers?.map(c => controllerRow({ ...c, online: true }))}
                    {settings.controllers?.map((controller) => {
                      if (!networkControllers) {
                        return controllerRow(controller);
                      }

                      if (!networkControllers.find(nc => nc.ip === controller.ip)) {
                        return controllerRow(controller);
                      }

                      return <></>;
                    })}
                  </ListGroup>
                </Row>
              )}
              {discoveryInProgress && (
                <Row className="lighting-controller-loading">
                  <Loading text={<FormattedMessage id="searching_for_lighting" />} />
                </Row>
              )}
            </FullWidthRow>
          </Container>
        </>
      )}
      {!isPresetsOpen && !discoveryInProgress && !isConfigureOpen && isAddOpen && (
        <>
          <AddNew
            title={<FormattedMessage id="add_new_lighting" />}
            defaultValue={<FormattedMessage id="ip_address" />}
            onCancel={() => setIsAddOpen(false)}
            fields={{ name: <FormattedMessage id="name" />, ip: <FormattedMessage id="ip" /> }}
            onConfirm={data => onControllerAdd(data.name, data.ip)}
          />
        </>
      )}
      {!isPresetsOpen && !discoveryInProgress && isConfigureOpen && (
        <ControllerDetail controller={selectedController} />
      )}
      {isPresetsOpen && (
        <Presets
          controller={selectedController}
          onClose={() => {
            setSelectedController(null);
            setIsPresetsOpen(false);
          }}
        />
      )}
    </>
  );
};

LightingControllers.defaultProps = {
  allowAdd: true,
  allowName: true,
  allowRemove: true,
  allowConfigure: true,
  buttons: null,
  skin: null,
  onConfigure: null,
};

LightingControllers.propTypes = propTypes;

export default LightingControllers;
