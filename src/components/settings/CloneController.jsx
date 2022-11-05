import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import { updateSettings } from '../../lib/settings-client';
import { createSkin, deleteSkin, getSkins } from '../../lib/style-client';

const CloneController = ({ cloneSource, setCloneSource, networkControllers }) => {
  const settings = useContext(SettingsContext);
  const [targetController, setTargetController] = useState();

  const targetControllers = (
    <Form.Select onChange={(o) => {
      if (o.target.value === 'select') {
        setTargetController(null);
      } else {
        setTargetController(o.target.value);
      }
    }}>
      <option value="select">Select...</option>
      {networkControllers?.map((c) => {
        if (c.ip !== cloneSource.ip) {
          return <option value={c.ip}>{`${c.ip} - ${c.name}`}</option>
        }
      })}
      {settings.controllers?.map((c) => {
        if (c.ip !== cloneSource.ip) {
          return <option value={c.ip}>{`${c.ip} - ${c.name}`}</option>
        }
      })}
    </Form.Select>
  );

  const updateSkin = (skin) => {
    deleteSkin(skin.name).then(() => {
      createSkin({
        name: skin.name,
        skin: skin,
      }).then(() => { });
    });
  };

  const saveSettings = async (updatedSettings) => {
    await updateSettings(updatedSettings);
  };

  const clone = async () => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const clonedController = deepClone.controllers?.find((c) => c.ip === cloneSource.ip);

    if (deepClone.controllers?.find((c) => c.ip === targetController.ip)) {
      const updatedController = deepClone.controllers?.find((c) => c.ip === targetController.ip);
      updatedController.segments = clonedController.segments;
    } else {
      deepClone.controllers.push({
        ip: targetController,
        segments: clonedController.segments
      });
    }

    await saveSettings(deepClone);

    const skins = await getSkins();
    skins.map((s) => {
      const applicableController = s.lighting?.controllers.find((c) => c.ip === cloneSource.ip);
      if (applicableController) {
        const clonedController = JSON.parse(JSON.stringify(applicableController));

        let updatedControllers = s.lighting?.controllers.filter((ec) => ec !== cloneSource.ip);

        if (!updatedControllers) {
          updatedControllers = [];
        }

        updatedControllers.push({
          ip: targetController,
          segments: clonedController.segments,
        });

        s.lighting.controllers = updatedControllers;

        // if (s.lighting?.controllers) {
        //   s.lighting.controllers.push({
        //     ip: targetController,
        //     segments: clonedController.segments,
        //   })
        // }

        updateSkin(s);
      }

      return null;
    });
  };

  return (
    <>
      <Container fluid>
        <Row>
          {targetControllers}
          <Button
            className="lighting-controller-button"
            onClick={() => {
              clone();
              setCloneSource(null);
            }}
            content="Clone"
            disabled={!targetController}
          />
          <Button
            className="lighting-controller-button"
            onClick={() => setCloneSource(null)}
            content="Cancel"
          />
        </Row>
      </Container>
    </>
  );
};

export default CloneController;