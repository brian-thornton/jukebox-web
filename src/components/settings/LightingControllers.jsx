import { TrashFill, PencilSquare, PlusSquare } from 'react-bootstrap-icons';
import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';


import Button from '../Button';
import ControllerDetail from './ControllerDetail';
import Item from '../common/Item';
import { SettingsContext } from '../layout/SettingsProvider';
import AddNew from '../common/AddNew';
import { updateSettings } from '../../lib/settings-client';
import './LightingControllers.scss';
import { discover, createSegment, reset } from '../../lib/lighting-client';
import Loading from '../common/Loading';
import NameInput from '../common/NameInput';
import CloneController from './CloneController';

const LightingControllers = ({ allowAdd = true, allowName = true, allowRemove = true, allowConfigure = true, buttons, skin, onConfigure = () => { } }) => {
  const settings = useContext(SettingsContext);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [selectedController, setSelectedController] = useState();
  const [discoveryInProgress, setDiscoveryInProgress] = useState(false);
  const [networkControllers, setNetworkControllers] = useState();
  const [updatedControllerName, setsUpdateControllerName] = useState();
  const [cloneSource, setCloneSource] = useState();

  const discoverControllers = () => {
    setDiscoveryInProgress(true);
    discover().then((data) => {
      data.forEach((c) => {
        const metaData = settings.controllers.find((m) => m.ip === c.ip);

        if (metaData) {
          c.segments = metaData.segments;
        }
      });

      const deepClone = JSON.parse(JSON.stringify(settings));

      if (deepClone.controllers) {
        deepClone.controllers.forEach((controller) => {
          const onlineController = data.find((c) => c.ip === controller.ip);
          if (onlineController) {
            controller.online = true;
          } else {
            controller.online = false;
          }
        });

        data.forEach((c) => {
          const knownController = deepClone.controllers?.find((kc) => c.ip === kc.ip);
          if (!knownController) {
            deepClone.controllers.push({ ...c, online: true });
          }
        })
      }

      updateSettings(deepClone, true);

      setNetworkControllers(data);
      setDiscoveryInProgress(false);
    });
  }

  useEffect(discoverControllers, []);

  const saveSettings = (updatedSettings, preventReload) => {
    updateSettings(updatedSettings).then(() => {
      if (!preventReload) {
        window.location.reload();
      }
    });
  };

  const onControllerAdd = async (name, ip) => {
    const deepClone = JSON.parse(JSON.stringify(settings));

    if (deepClone.controllers) {
      if (!deepClone.controllers.find((c) => c.ip === ip)) {
        deepClone.controllers.push({
          name,
          ip
        })
      }
    } else {
      deepClone.controllers = [
        {
          name,
          ip
        }
      ];
    }

    saveSettings(deepClone);
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
                {allowName && <NameInput defaultValue={controller.name} onChange={(event) => setsUpdateControllerName(event.target.value)} />}
              </Col>
            </Row>
          </Container>
        )}
        buttons={(
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
            {buttons?.length && buttons.map((b) => b)}
          </>
        )}
      />
    );
  }

  return (
    <>
      {!isConfigureOpen && !isAddOpen && (
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
                content="Discover"
              />
            </>
          )}
          <Container fluid className="styleEditorContent">
            <Row>
              <Col lg="12" xl="12" md="12" sm="12">
                {!discoveryInProgress && (
                  <Row>
                    <ListGroup className="styleEditorContent">
                      {networkControllers?.map((controller) => controllerRow({ ...controller, online: true }))}
                      {settings.controllers?.map((controller) => {
                        if (!networkControllers) {
                          return controllerRow(controller)
                        } else {
                          if (!networkControllers.find((nc) => nc.ip === controller.ip)) {
                            return controllerRow(controller)
                          }
                        }
                      })}
                    </ListGroup>
                  </Row>
                )}
                {discoveryInProgress && (
                  <Row className="lighting-controller-loading">
                    <Loading text="Searching for lighting controllers..." />
                  </Row>
                )}
              </Col>
            </Row>
          </Container>
        </>
      )}
      {!discoveryInProgress && !isConfigureOpen && isAddOpen && (
        <>
          <AddNew
            title="Add New Lighting Controller"
            defaultValue="IP Address"
            onCancel={() => setIsAddOpen(false)}
            fields={{ name: 'Name', ip: 'ip' }}
            onConfirm={(data) => onControllerAdd(data.name, data.ip)}
          />
        </>
      )}
      {!discoveryInProgress && isConfigureOpen && (
        <ControllerDetail controller={selectedController} />
      )}
    </>
  );
};

export default LightingControllers;