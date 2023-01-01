import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';

import Button from '../../Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import NameInput from '../../common/NameInput';
import { deleteSkin, createSkin } from '../../../lib/style-client';
import { Skin } from '../../shapes';

import './SkinPreferences.scss';
import SkinNavPreference from './SkinNavPreference';
import SkinNavButtonSize from './SkinNavButtonSize';
import SkinControlButtonSize from './SkinControlButtonSize';

const propTypes = {
  skin: Skin.isRequired,
};

const SkinPreferences = ({ skin }) => {
  const [navButtonType, setNavButtonType] = useState(skin.navButtonType || 'buttons');
  const [navButtonSize, setNavButtonSize] = useState(skin.navButtonSize || 'small');
  const [controlButtonSize, setControlButtonSize] = useState(skin.controlButtonSize || 'small');
  const [updatedName, setUpdatedName] = useState();
  const settings = useContext(SettingsContext);

  const saveSkin = (newName = skin.name) => {
    deleteSkin(skin.name).then(() => {
      const { name, ...colors } = skin;

      const updatedSkin = {
        name: newName,
        skin: {
          ...colors,
          name: newName,
          navButtonType,
          navButtonSize,
          controlButtonSize,
        },
      };

      createSkin(updatedSkin).then(() => { });
    });
  };

  return (
    <Card className="skin-detail-card">
      <Card.Title style={{ marginTop: '5px', color: settings.styles.fontColor }}>
        <Container fluid>
          <Row className="skin-name-row">
            <Col lg="2" md="2" sm="2">
              <div className="skin-name-label">Skin Name:</div>
            </Col>
            <Col lg="9" md="9" sm="9">
              <NameInput
                disabled={!skin.isEditable}
                defaultValue={skin.name}
                onChange={e => setUpdatedName(e.target.value)}
              />
            </Col>
            <Col lg="1" md="1" sm="1">
              <Button classNam="skin-detail-save" content="Save" onClick={() => saveSkin(updatedName)} disabled={!skin.isEditable} />
            </Col>
          </Row>
          <Row>
            <SkinNavPreference skin={skin} navButtonType={navButtonType} setNavButtonType={setNavButtonType} />
          </Row>
          <Row>
            <SkinNavButtonSize skin={skin} navButtonSize={navButtonSize} setNavButtonSize={setNavButtonSize} />
          </Row>
          <Row>
            <SkinControlButtonSize skin={skin} controlButtonSize={controlButtonSize} setNavButtonSize={setControlButtonSize} />
          </Row>
        </Container>
      </Card.Title>
    </Card>
  );
};

SkinPreferences.propTypes = propTypes;

export default SkinPreferences;
