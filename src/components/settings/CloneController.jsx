import Form from 'react-bootstrap/Form';
import React, { useContext, useState } from 'react';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import { updateSettings } from '../../lib/settings-client';
import { createSkin, deleteSkin, getSkins } from '../../lib/style-client';

const CloneController = ({ cloneSource, setCloneSource, networkControllers }) => {
  const settings = useContext(SettingsContext);
  const [targetController, setTargetController] = useState();

  const targetControllers = (
    <Form.Select onChange={(o) => setTargetController(o.target.value)}>
      {networkControllers?.map((c) => <option value={c.ip}>{`${c.ip} - ${c.name}`}</option>)}
      {settings.controllers?.map((c) => <option value={c.ip}>{`${c.ip} - ${c.name}`}</option>)}
    </Form.Select>
  );

  const updateSkin = (skin) => {
    deleteSkin(skin.name).then(() => {
      const newObject = {
        ...skin,
      };

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

    deepClone.controllers.push({
      ip: targetController,
      segments: clonedController.segments
    });

    await saveSettings(deepClone);

    const skins = await getSkins();
    skins.map((s) => {
      const applicableController = s.lighting?.controllers.find((c) => c.ip === cloneSource.ip);
      if (applicableController) {
        const clonedController = JSON.parse(JSON.stringify(applicableController));

        if (s.lighting?.controllers) {
          s.lighting.controllers.push({
            ip: targetController,
            segments: clonedController.segments,
          })
        }

        updateSkin(s);
      }

      return null;
    });
  };

  return (
    <>
      Clone To:
      {targetControllers}
      <Button
        className="lighting-controller-button"
        onClick={() => {
          clone();
          setCloneSource(null);
        }}
        content="Clone"
      />
      <Button
        className="lighting-controller-button"
        onClick={() => setCloneSource(null)}
        content="Cancel"
      />
    </>
  );
};

export default CloneController;