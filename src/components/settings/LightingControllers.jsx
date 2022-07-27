import { PlusSquare } from 'react-bootstrap-icons';
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
import styles from './LightingControllers.module.css';
import { discover } from '../../lib/lighting-client';
import Loading from '../common/Loading';
import NameInput from '../common/NameInput';

const LightingControllers = ({ allowAdd = true, allowName = true, allowRemove = true, allowConfigure = true, buttons, skin, onConfigure = () => { } }) => {
  const settings = useContext(SettingsContext);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [selectedController, setSelectedController] = useState();
  const [discoveryInProgress, setDiscoveryInProgress] = useState(false);
  const [networkControllers, setNetworkControllers] = useState();
  const [updatedControllerName, setsUpdateControllerName] = useState();

  const discoverControllers = () => {
    setDiscoveryInProgress(true);
    discover().then((data) => {
      setNetworkControllers(data);
      setDiscoveryInProgress(false);
    });
  }

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

    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const onControllerRemove = (ip) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.controllers = deepClone.controllers.filter((f) => f.ip !== ip);

    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const onSetName = async (controller) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const updatedController = deepClone.controllers?.find((c) => c.ip === controller.ip);

    if (!updatedController) {
      //
    } else {
      updatedController.name = updatedControllerName;
    }

    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const controllerRow = (controller) => {
    return (
      <Item
        text={(
          <>
            {controller.ip}
            {!allowName && <div>{controller.name}</div>}
            {allowName && <NameInput defaultValue={controller.name} onChange={(event) => setsUpdateControllerName(event.target.value)} />}
          </>
        )}
        buttons={(
          <>
            {allowRemove && (
              <Button
                style={{ float: 'right', width: '100px' }}
                onClick={() => onControllerRemove(controller.ip)}
                content="Remove"
              />
            )}
            {allowConfigure && (
              <>
                <Button
                  style={{ float: 'right', width: '100px' }}
                  onClick={() => {
                    setIsConfigureOpen(true);
                    setSelectedController(controller);
                    onConfigure(controller);
                  }}
                  content="Configure"
                />
                <Button
                  style={{ float: 'right', width: '100px' }}
                  onClick={() => {
                    onSetName(controller);
                  }}
                  content="Save"
                />
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
          <Container fluid className={styles.styleEditorContent}>
            <Row>
              <Col lg="12" xl="12" md="12" sm="12">
                {!discoveryInProgress && (
                  <Row>
                    <ListGroup className={styles.styleEditorContent}>
                      {settings.controllers?.map((controller) => controllerRow(controller))}
                    </ListGroup>
                  </Row>
                )}
                {discoveryInProgress && (
                  <Row style={{ width: '100%' }}>
                    <Loading />
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
            fields={{name: 'Name', ip: 'ip'}}
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