import { Card } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { injectIntl } from 'react-intl';

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
  intl,
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
        <Button onClick={goBackToThemeList} content={intl.formatMessage({ id: 'back_to_skins' })} />
        <Button onClick={() => goBackToThemeList(true)} content={intl.formatMessage({ id: 'save_and_apply' })} />
        <Button onClick={() => setIsSaveAsModalOpen(true)} content={intl.formatMessage({ id: 'save_as' })} />
        <Button onClick={() => setIsDeleteConfirmOpen(true)} content={intl.formatMessage({ id: 'delete' })} disabled={!skin.isEditable} />
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
          title={`${intl.formatMessage({ id: 'save' })} ${skin.name} ${intl.formatMessage({ id: 'as' })}...`}
          defaultValue={`${skin.name} ${intl.formatMessage({ id: 'copy' })}`}
          fields={{ name: intl.formatMessage({ id: 'name' }) }}
          onCancel={() => setIsSaveAsModalOpen(false)}
          onConfirm={data => handleSkinSaveAs(data)}
        />
      )}
      {isDeleteConfirmOpen && (
        <Confirm
          text={intl.formatMessage({ id: 'delete_skin_text' })}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          onConfirm={onDeleteConfirm}
        />
      )}
      {!isDeleteConfirmOpen && !isSaveAsModalOpen && (
        <Card className="skin-detail-card">
          <Tabs activeKey={activeKey} onSelect={k => setActiveKey(k)}>
            <Tab eventKey="preferences" title={intl.formatMessage({ id: 'skin_preferences' })}>
              <SkinPreferences skin={skin} />
            </Tab>
            <Tab eventKey="colors" title={intl.formatMessage({ id: 'skin_colors' })}>
              <SkinColors skin={skin} />
            </Tab>
            <Tab eventKey="fonts" title={intl.formatMessage({ id: 'skin_fonts' })}>
              <SkinFonts loadSkins={loadSkins} skin={skin} />
            </Tab>
            <Tab eventKey="graphics" title={intl.formatMessage({ id: 'skin_graphics' })}>
              <SkinGraphics skin={skin} />
            </Tab>
            <Tab eventKey="lights" title={intl.formatMessage({ id: 'skin_lighting' })}>
              <SkinLights skin={skin} loadSkins={loadSkins} />
            </Tab>
          </Tabs>
        </Card>
      )}
    </>
  );

  return content();
};

export default injectIntl(SkinDetail);
