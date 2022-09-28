import { Card } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSearchParams, useNavigate } from 'react-router-dom';

import AddNew from '../../common/AddNew';
import ControlButton from '../../common/ControlButton';
import Confirm from '../../common/Confirm';
import { createSkin } from '../../../lib/style-client';
import SkinColors from './SkinColors';
import SkinFonts from './SkinFonts';
import SkinGraphics from './SkinGraphics';
import SkinLights from './SkinLights';
import './SkinDetail.scss';
import SkinPreferences from './SkinPreferences';
import { deleteSkin } from '../../../lib/style-client';

const SkinDetail = ({
  skin,
  goBackToThemeList,
  setControls,
  loadSkins,
}) => {
  const navigate = useNavigate();
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

  const controls = () => (
    <>
      <ControlButton width="100%" onClick={goBackToThemeList} text="Back to Settings" />
      <ControlButton width="100%" onClick={() => {
        goBackToThemeList(true);
      }} text="Save and Apply" />
      <ControlButton width="100%" onClick={() => setIsSaveAsModalOpen(true)} text="Save As" />
      <ControlButton width="100%" onClick={() => setIsDeleteConfirmOpen(true)} text="Delete" />
    </>
  );

  if (!isContextSet) {
    setControls(controls());
    setIsContextSet(true);
  }

  const handleSkinSaveAs = (data) => {
    const { name, isEditable, ...colors } = skin;

    createSkin({
      name: data.name,
      skin: {
        name: data.name,
        isEditable: true,
        ...colors
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
      {isSaveAsModalOpen && (
        <AddNew
          title={`Save ${skin.name} as...`}
          defaultValue={`${skin.name} Copy`}
          fields={{ name: 'Name' }}
          onCancel={() => setIsSaveAsModalOpen(false)}
          onConfirm={(data) => handleSkinSaveAs(data)}
        />
      )}
      {isDeleteConfirmOpen && (
        <Confirm
          text="Are you sure you want to delete the skin?"
          onCancel={() => setIsDeleteConfirmOpen(false)}
          onConfirm={onDeleteConfirm}
        />
      )}
      {!isDeleteConfirmOpen && !isSaveAsModalOpen && (
        <Card className="skin-detail-card">
          <Tabs activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
            <Tab eventKey="preferences" title="Skin Preferences">
              <SkinPreferences skin={skin} />
            </Tab>
            <Tab eventKey="colors" title="Skin Colors">
              <SkinColors skin={skin} />
            </Tab>
            <Tab eventKey="fonts" title="Skin Fonts">
              <SkinFonts loadSkins={loadSkins} skin={skin} />
            </Tab>
            <Tab eventKey="graphics" title="Skin Graphics">
              <SkinGraphics skin={skin} />
            </Tab>
            <Tab eventKey="lights" title="Skin Lighting">
              <SkinLights skin={skin} />
            </Tab>
          </Tabs>
        </Card>
      )}
    </>
  );

  return content();
}
export default SkinDetail;
