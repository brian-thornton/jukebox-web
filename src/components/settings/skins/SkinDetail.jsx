import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FormattedMessage, useIntl } from 'react-intl';

import AddNew from '../../common/AddNew';
import Confirm from '../../common/Confirm';
import { createSkin, deleteSkin } from '../../../lib/style-client';
import SkinColors from './SkinColors';
import SkinFonts from './SkinFonts';
import SkinGraphics from './SkinGraphics';
import SkinLights from './SkinLights';
import './SkinDetail.scss';
import SkinPreferences from './SkinPreferences';
import Button from '../../Button';
import Picker from '../../common/Picker';

const SkinDetail = ({
  skin,
  goBackToThemeList,
  setControls,
  loadSkins,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeKey, setActiveKey] = useState();
  const [isContextSet, setIsContextSet] = useState(false);
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const intl = useIntl();

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveKey(searchParams.get('tab'));
    }
  }, []);

  const controls = (
    <Container fluid style={{marginBottom: '20px'}}>
      <Row>
        <Button onClick={goBackToThemeList} content={<FormattedMessage id="back_to_skins" />} />
        <Button onClick={() => goBackToThemeList(true)} content={<FormattedMessage id="save_and_apply" />} />
        <Button onClick={() => setIsSaveAsModalOpen(true)} content={<FormattedMessage id="save_as" />} />
        <Button onClick={() => setIsDeleteConfirmOpen(true)} content={<FormattedMessage id="delete" />} disabled={!skin.isEditable} />
      </Row>
    </Container>
  );

  if (!isContextSet) {
    setControls(controls);
    setIsContextSet(true);
  }

  const handleSkinSaveAs = (data) => {
    const { name, isEditable, ...colors } = skin;

    createSkin({
      name: data.name,
      skin: {
        name: data.name,
        isEditable: true,
        ...colors,
      },
    }).then(() => setIsSaveAsModalOpen(false));
  };

  const onDeleteConfirm = () => {
    deleteSkin(skin.name).then(() => {
      window.location.reload();
    });
  };

  const content = () => (
    <>
      {!activeKey && controls}
      {isSaveAsModalOpen && (
        <AddNew
          title={<FormattedMessage id="save_skin_as" values={{ name: skin.name }} />}
          defaultValue={intl.formatMessage({id: "skin_copy"}, { name: skin.name })}
          fields={{ name: intl.formatMessage({id: "skin_copy"}, { name: skin.name })}}
          onCancel={() => setIsSaveAsModalOpen(false)}
          onConfirm={data => handleSkinSaveAs(data)}
        />
      )}
      {isDeleteConfirmOpen && (
        <Confirm
          text={<FormattedMessage id="delete_skin_text" />}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          onConfirm={onDeleteConfirm}
        />
      )}
      {!isDeleteConfirmOpen && !isSaveAsModalOpen && (
        <>
          {activeKey === "preferences" && <SkinPreferences skin={skin} onClose={() => setActiveKey('')} />}
          {activeKey === "colors" && <SkinColors skin={skin} onClose={() => setActiveKey('')} />}
          {activeKey === "fonts" && <SkinFonts skin={skin} onClose={() => setActiveKey('')} />}
          {activeKey === "graphics" && <SkinGraphics skin={skin} onClose={() => setActiveKey('')} />}
          {activeKey === "lights" && <SkinLights skin={skin} onClose={() => setActiveKey('')} />}
          {!activeKey && (
            <Picker items={[
              {
                description: <FormattedMessage id="skin_preference_description" />,
                title: <FormattedMessage id="skin_preference_title" />,
                buttonText: <FormattedMessage id="skin_preference_button" />,
                onClick: () => setActiveKey('preferences'),
              },
              {
                description: <FormattedMessage id="skin_colors_description" />,
                title: <FormattedMessage id="skin_colors_title" />,
                buttonText: <FormattedMessage id="skin_colors_button" />,
                onClick: () => setActiveKey('colors'),
              },
              {
                description: <FormattedMessage id="skin_fonts_description" />,
                title: <FormattedMessage id="skin_fonts_title" />,
                buttonText: <FormattedMessage id="skin_fonts_button" />,
                onClick: () => setActiveKey('fonts'),
              },
              {
                description: <FormattedMessage id="skin_graphics_description" />,
                title: <FormattedMessage id="skin_graphics_title" />,
                buttonText: <FormattedMessage id="skin_graphics_button" />,
                onClick: () => setActiveKey('graphics'),
              },
              {
                description: <FormattedMessage id="skin_lighting_description" />,
                title: <FormattedMessage id="skin_lighting_title" />,
                buttonText: <FormattedMessage id="skin_lighting_button" />,
                onClick: () => setActiveKey('lights'),
              }
            ]} />
          )}
        </>
      )}
    </>
  );

  return content();
};

export default SkinDetail;
