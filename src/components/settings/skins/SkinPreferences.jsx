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

import './SkinPreferences.scss';

const SkinPreferences = ({ skin }) => {
  const [navButtonType, setNavButtonType] = useState('buttons');
  const [updatedName, setUpdatedName] = useState();
  const settings = useContext(SettingsContext);
  
  const saveSkin = (newName = skin.name) => {
    deleteSkin(skin.name).then(() => {
      const { name, ...colors } = skin;

      createSkin({
        name: newName,
        skin: { name: newName, navButtonType, ...colors },
      }).then(() => { });
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
                defaultValue={skin.name}
                onChange={e => setUpdatedName(e.target.value)}
              />
            </Col>
            <Col lg="1" md="1" sm="1">
              <Button classNam="skin-detail-save" content="Save" onClick={() => saveSkin(updatedName)} />
            </Col>
          </Row>
          <Row>
            <Form>
              <div key={navButtonType} className="mb-3">
                <Form.Check
                  inline
                  label="Nav as Links"
                  name="group1"
                  type="radio"
                  id="links"
                  onChange={() => setNavButtonType("links")}
                />
                <Form.Check
                  inline
                  label="Nav as Buttons"
                  name="group1"
                  type="radio"
                  id="buttons"
                  onChange={() => setNavButtonType("buttons")}
                />
              </div>
            </Form>
          </Row>
        </Container>
      </Card.Title>
    </Card>
  );
};

export default SkinPreferences;
