
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';

import Item from '../../common/Item';
import Button from '../../Button';
import './SkinDetail.scss';
import { deleteSkin, createSkin } from '../../../lib/style-client';
import FilePicker from '../../common/FilePicker';

const SkinGraphics = ({ skin }) => {
  const [isFilePickerOpen, setIsFilePickerOpen] = useState();
  const [imageKey, setImageKey] = useState();

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
    deleteSkin(updatedSkin.name).then(() => {
      const newObject = {
        ...skin,
        [key]: value,
      };

      createSkin({
        name: newObject.name,
        skin: newObject,
      });
    });
  };

  const fileInputRow = (name, display) => (
    <Item
      text={display}
      buttons={(
        <>
          <Button
            disabled={!skin.isEditable}
            style={{ float: 'right', width: '100px' }}
            onClick={() => {
              setImageKey(name);
              setIsFilePickerOpen(true);
            }}
            content="Select Image"
          />
          <Button
            disabled={!skin.isEditable}
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
        <Container fluid className="styleEditorContent">
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row>
                <ListGroup className="styleEditorContent">
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