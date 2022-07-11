
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import React, { useState, useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import ColorCopy from './ColorCopy';
import Item from '../common/Item';
import { SettingsContext } from '../layout/SettingsProvider';
import ColorPicker from './ColorPicker';
import Button from '../Button';
import Paginator from '../common/Paginator';
import styles from './SkinDetail.module.css';
import { deleteSkin, createSkin } from '../../lib/style-client';
import FilePicker from '../common/FilePicker';

const SkinGraphics = ({ skin }) => {
  const [isFilePickerOpen, setIsFilePickerOpen] = useState();
  const [imageKey, setImageKey] = useState();
  const settings = useContext(SettingsContext);
  const { preferences } = settings;

  const imageUpload = (e) => {
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
      updateSkin(skin, imageKey, base64);
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

  const updateSkin = (updatedSkin, key, value) => {
    const { name, isEditable, ...colors } = skin;

    deleteSkin(updatedSkin.name).then(() => {
      console.log({
        name: updatedSkin.name,
        skin: { [key]: value, ...colors },
      });
      createSkin({
        name: updatedSkin.name,
        skin: { [key]: value, ...colors },
      }).then(() => alert('good')).catch((err) => console.log(err));
    });
  };

  const fileInputRow = (name, display) => (
    <Item
      text={display}
      buttons={(
        <>
          <Button
            style={{ float: 'right', width: '100px' }}
            onClick={() => {
              setImageKey(name);
              setIsFilePickerOpen(true);
            }}
            content="Select Image"
          />
          <Button
            onClick={() => {
              setImageKey(null);
              setIsFilePickerOpen(false);
            }}
            content="Clear Image"
          />
        </>
      )}
    />
  );

  const rows = [
    fileInputRow('defaultAlbumCover', 'Default Album Cover'),
    fileInputRow('wallpaper', 'Wallpaper'),
  ];

  const onImageSelectCancel = () => {
    setImageKey(null);
    setIsFilePickerOpen(false);
  }

  return (
    <>
      {isFilePickerOpen && (
        <FilePicker 
          title={`Select image for ${imageKey}`}
          onCancel={onImageSelectCancel}
          onSelectFile={imageUpload}
        />
      )}
      {!isFilePickerOpen && (
        <Container fluid className={styles.styleEditorContent}>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row>
                <ListGroup className={styles.styleEditorContent}>
                  {rows}
                </ListGroup>
              </Row>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default SkinGraphics;