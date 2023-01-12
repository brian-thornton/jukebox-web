import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import { updateSettings } from '../../lib/settings-client';
import { createSkin, deleteSkin, getSkins } from '../../lib/style-client';
import { LightingController } from '../shapes';

const propTypes = {
  cloneSource: LightingController.isRequired,
  setCloneSource: PropTypes.func.isRequired,
  networkControllers: PropTypes.arrayOf(LightingController),
};

const CloneController = ({ cloneSource, setCloneSource, networkControllers }) => {
  const settings = useContext(SettingsContext);
  const [targetController, setTargetController] = useState();

  const targetControllers = (
    <Form.Select
      onChange={(o) => {
        if (o.target.value === 'select') {
          setTargetController(null);
        } else {
          setTargetController(o.target.value);
        }
      }}
    >
      <option value="select">{<FormattedMessage id="select" />}</option>
      {networkControllers?.map((c) => {
        let option = <></>;
        if (c.ip !== cloneSource.ip) {
          option = <option value={c.ip}>{`${c.ip} - ${c.name}`}</option>;
        }

        return option;
      })}
      {settings.controllers?.map((c) => {
        let option = <></>;
        if (!networkControllers.find(nc => nc.ip === c.ip) && c.ip !== cloneSource.ip && c.online) {
          option = <option value={c.ip}>{`${c.ip} - ${c.name}`}</option>;
        }

        return option;
      })}
    </Form.Select>
  );

  const updateSkin = (skin) => {
    deleteSkin(skin.name).then(() => {
      createSkin({
        name: skin.name,
        skin,
      }).then(() => { });
    });
  };

  const saveSettings = async (updatedSettings) => {
    await updateSettings(updatedSettings);
  };

  const clone = async () => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const clonedController = deepClone.controllers?.find(c => c.ip === cloneSource.ip);

    if (deepClone.controllers?.find(c => c.ip === targetController)) {
      const updatedController = deepClone.controllers?.find(c => c.ip === targetController);
      updatedController.segments = clonedController.segments;
    } else {
      deepClone.controllers.push({
        ip: targetController,
        segments: clonedController.segments,
      });
    }

    await saveSettings(deepClone);

    const skins = await getSkins();
    skins.map((s) => {
      const applicableController = s.lighting?.controllers.find(c => c.ip === cloneSource.ip);
      if (applicableController) {
        const controller = JSON.parse(JSON.stringify(applicableController));

        let updatedControllers = s.lighting?.controllers.filter(ec => ec !== cloneSource.ip);

        if (!updatedControllers) {
          updatedControllers = [];
        }

        updatedControllers.push({
          ip: targetController,
          segments: controller.segments,
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
            content={<FormattedMessage id="clone" />}
            disabled={!targetController}
          />
          <Button
            className="lighting-controller-button"
            onClick={() => setCloneSource(null)}
            content={<FormattedMessage id="cancel" />}
          />
        </Row>
      </Container>
    </>
  );
};

CloneController.defaultProps = {
  networkControllers: null,
};

CloneController.propTypes = propTypes;

export default CloneController;
