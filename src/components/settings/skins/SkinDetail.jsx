import { Card } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FormattedMessage } from 'react-intl';

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

const SkinDetail = ({
  skin,
  goBackToThemeList,
  setControls,
  loadSkins,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeKey, setActiveKey] = useState('preferences');
  const [isContextSet, setIsContextSet] = useState(false);
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveKey(searchParams.get('tab'));
    }
  }, []);

  const controls = (
    <Container fluid>
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
      {controls}
      {isSaveAsModalOpen && (
        <AddNew
          title={<FormattedMessage id="skin_save_as" values={{ name: skin.name }} />}
          defaultValue={<FormattedMessage id="skin_copy" values={{ name: skin.name }} />}
          fields={{ name: <FormattedMessage id="name" /> }}
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
        <Card className="skin-detail-card">
          <Tabs activeKey={activeKey} onSelect={k => setActiveKey(k)}>
            <Tab eventKey="preferences" title={<FormattedMessage id="skin_preferences" />}>
              <SkinPreferences skin={skin} />
            </Tab>
            <Tab eventKey="colors" title={<FormattedMessage id="skin_colors" />}>
              <SkinColors skin={skin} />
            </Tab>
            <Tab eventKey="fonts" title={<FormattedMessage id="skin_fonts" />}>
              <SkinFonts loadSkins={loadSkins} skin={skin} />
            </Tab>
            <Tab eventKey="graphics" title={<FormattedMessage id="skin_graphics" />}>
              <SkinGraphics skin={skin} />
            </Tab>
            <Tab eventKey="lights" title={<FormattedMessage id="skin_lighting" />}>
              <SkinLights skin={skin} loadSkins={loadSkins} />
            </Tab>
          </Tabs>
        </Card>
      )}
    </>
  );

  return content();
};

export default SkinDetail;
