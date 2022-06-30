import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';
import Item from '../common/Item';
import { SettingsContext } from '../layout/SettingsProvider';
import { updateSettings } from '../../lib/settings-client';
import NameInput from '../common/NameInput';

const Preferences = () => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);
  const { preferences } = settings;

  const rowLabel = (value) => {
    const result = value.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }

  const updatePreference = (preferenceName, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.preferences[preferenceName] = value;
    updateSettings(deepClone);
  };

  const toggleRow = (rowName, value) => {
    const buttonText = value ? 'Enabled' : 'Disabled';

    return (
      <Item
        style={{ width: '100%' }}
        buttons={(
          <Button
            onClick={() => updatePreference(rowName, !value)}
            isToggle
            isToggled={value}
            content={buttonText}
          />
        )}
        text={rowLabel(rowName)}
      />
    );
  };

  const imageUpload = (e) => {
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
      localStorage["jukebox-wallpaper"] = base64;
      navigate('/albums');
    });
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const itemStyle = {
    color: settings.styles.fontColor,
    background: settings.styles.trackBackgroundColor,
    fontFamily: settings.styles.listFont,
    width: '100%',
    height: '60px',
  };

  const textInputRow = (rowName, value) => (
    <ListGroupItem style={itemStyle}>
      <Container fluid style={{ marginBottom: '0px' }}>
        <Row>
          <Col lg="2">
            {rowLabel(rowName)}
          </Col>
          <Col lg="8">
            <NameInput
              defaultValue={value}
              onChange={event => updatePreference(rowName, event.target.value)}
            />
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );

  const fileInputRow = (rowName) => (
    <ListGroupItem style={{
      color: settings.styles.fontColor,
      background: settings.styles.trackBackgroundColor,
      fontFamily: settings.styles.listFont,
      height: '60px',
    }}>
      <Container fluid style={{ marginBottom: '0px' }}>
        <Row>
          <Col lg="2">
            {rowLabel(rowName)}
          </Col>
          <Col lg="8">
            <Form.Group className="mb-3" controlId="title" style={{ marginBottom: '0px' }}>
              <Form.Control style={{ marginBottom: '0px' }} type="file" onChange={imageUpload} />
            </Form.Group>
          </Col>
          <Col lg="2">
            <Button
              onClick={() => {
                localStorage.removeItem("jukebox-wallpaper");
                navigate('/albums');
              }}
              content="Clear"
            />
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="12" md="12">
            <ListGroup>
              {textInputRow('name', preferences.name)}
              {toggleRow('showAlbumName', preferences.showAlbumName)}
              {toggleRow('showAlbumsWithoutCoverArt', preferences.showAlbumsWithoutCoverArt)}
              {toggleRow('pinEnabled', preferences.pinEnabled)}
              {textInputRow('pin', preferences.pin)}
              {fileInputRow('jukeboxWallpaper')}
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={() => window.location.reload()} content="Save" />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Preferences;
