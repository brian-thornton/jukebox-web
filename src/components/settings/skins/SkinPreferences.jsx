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
            <Form>
              <Form.Group>
                <div key={navButtonType} className="mb-3">
                  <Form.Check
                    inline
                    disabled={!skin.isEditable}
                    label="Nav as Links"
                    name="group1"
                    type="radio"
                    id="links"
                    value="links"
                    checked={navButtonType === 'links'}
                    onChange={() => setNavButtonType('links')}
                  />
                  <Form.Check
                    inline
                    disabled={!skin.isEditable}
                    label="Nav as Buttons"
                    name="group1"
                    type="radio"
                    id="buttons"
                    value="buttons"
                    checked={navButtonType === 'buttons'}
                    onChange={() => setNavButtonType('buttons')}
                  />
                </div>
              </Form.Group>
            </Form>
          </Row>
          <Row>
            <Form>
              <Form.Group>
                <div key={navButtonSize} className="mb-3">
                  <Form.Check
                    inline
                    disabled={!skin.isEditable}
                    label="Small Nav Buttons"
                    name="group2"
                    type="radio"
                    id="smallNavButtons"
                    value="small"
                    checked={navButtonSize === 'small'}
                    onChange={() => setNavButtonSize('small')}
                  />
                  <Form.Check
                    inline
                    disabled={!skin.isEditable}
                    label="Medium Nav Buttons"
                    name="group2"
                    type="radio"
                    id="mediumNavButtons"
                    value="medium"
                    checked={navButtonSize === 'medium'}
                    onChange={() => setNavButtonSize('medium')}
                  />
                  <Form.Check
                    inline
                    disabled={!skin.isEditable}
                    label="Large Nav Buttons"
                    name="group2"
                    type="radio"
                    id="largeNavButtons"
                    value="large"
                    checked={navButtonSize === 'large'}
                    onChange={() => setNavButtonSize('large')}
                  />
                </div>
              </Form.Group>
            </Form>
          </Row>
          <Row>
            <Form>
              <Form.Group>
                <div key={controlButtonSize} className="mb-3">
                  <Form.Check
                    inline
                    disabled={!skin.isEditable}
                    label="Small Control Buttons"
                    name="group3"
                    type="radio"
                    id="smallControlButtons"
                    value="small"
                    checked={controlButtonSize === 'small'}
                    onChange={() => setControlButtonSize('small')}
                  />
                  <Form.Check
                    inline
                    disabled={!skin.isEditable}
                    label="Medium Control Buttons"
                    name="group3"
                    type="radio"
                    id="mediumControlButtons"
                    value="medium"
                    checked={controlButtonSize === 'medium'}
                    onChange={() => setControlButtonSize('medium')}
                  />
                  <Form.Check
                    inline
                    disabled={!skin.isEditable}
                    label="Large Control Buttons"
                    name="group3"
                    type="radio"
                    id="largeControlButtons"
                    value="large"
                    checked={controlButtonSize === 'large'}
                    onChange={() => setControlButtonSize('large')}
                  />
                </div>
              </Form.Group>
            </Form>
          </Row>
        </Container>
      </Card.Title>
    </Card>
  );
};

SkinPreferences.propTypes = propTypes;

export default SkinPreferences;
