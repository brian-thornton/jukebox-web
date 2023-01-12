import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState } from 'react';
import { injectIntl } from 'react-intl';

import Item from '../../common/Item';
import Button from '../../Button';
import './SkinDetail.scss';
import { deleteSkin, createSkin } from '../../../lib/style-client';
import FilePicker from '../../common/FilePicker';
import { Skin } from '../../shapes';
import FullWidthRow from '../../common/FullWidthRow';

const propTypes = {
  skin: Skin.isRequired,
};

const SkinGraphics = ({ intl, skin }) => {
  const [isFilePickerOpen, setIsFilePickerOpen] = useState();
  const [imageKey, setImageKey] = useState();

  const getBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });

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

  const imageUpload = (e) => {
    const file = e.target.files[0];
    getBase64(file).then((base64) => {
      updateSkin(skin, imageKey, base64);
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
            content={intl.formatMessage({ id: 'select_image' })}
          />
          <Button
            disabled={!skin.isEditable}
            onClick={() => {
              setImageKey(null);
              setIsFilePickerOpen(false);
            }}
            content={intl.formatMessage({ id: 'clear_image' })}
          />
        </>
      )}
    />
  );

  const rows = [
    fileInputRow('defaultAlbumCover', intl.formatMessage({ id: 'default_album_cover' })),
    fileInputRow('wallpaper', intl.formatMessage({ id: 'wallpaper' })),
  ];

  const onImageSelectCancel = () => {
    setImageKey(null);
    setIsFilePickerOpen(false);
  };

  return (
    <>
      {isFilePickerOpen && (
        <FilePicker
          title={`${intl.formatMessage({ id: 'select_image_for' })} ${imageKey}`}
          onCancel={onImageSelectCancel}
          onSelectFile={imageUpload}
        />
      )}
      {!isFilePickerOpen && (
        <Container fluid className="styleEditorContent">
          <FullWidthRow>
            <ListGroup className="styleEditorContent">
              {rows}
            </ListGroup>
          </FullWidthRow>
        </Container>
      )}
    </>
  );
};

SkinGraphics.propTypes = propTypes;

export default injectIntl(SkinGraphics);
