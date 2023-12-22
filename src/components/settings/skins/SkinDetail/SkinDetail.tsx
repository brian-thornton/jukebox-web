import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

import AddNew from '../../../common/AddNew/AddNew';
import Confirm from '../../../common/Confirm/Confirm';
import { createSkin, deleteSkin } from '../../../../lib/service-clients/style-client';
import SkinColors from '../SkinColors/SkinColors';
import SkinFonts from '../SkinFonts/SkinFonts';
import SkinGraphics from '../SkinGraphics/SkinGraphics';
import SkinLights from '../SkinLights/SkinLights';
import styles from './SkinDetail.module.css';
import SkinPreferences from '../SkinPreferences/SkinPreferences';
import Button from '../../../Button';
import Picker from '../../../common/Picker/Picker';
import { ISkin } from '../../../interface';

interface ISkinDetail {
  skin: ISkin,
  goBackToThemeList: Function,
  setControls: Function,
  loadSkins: Function,
}

const SkinDetail: FC<ISkinDetail> = ({
  skin,
  goBackToThemeList,
  setControls,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>();
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
    <div className={styles.buttonContainer}>
      <Button onClick={goBackToThemeList} content={<FormattedMessage id="back_to_skins" />} />
      <Button onClick={() => goBackToThemeList(true)} content={<FormattedMessage id="save_and_apply" />} />
      <Button onClick={() => setIsSaveAsModalOpen(true)} content={<FormattedMessage id="save_as" />} />
      <Button onClick={() => setIsDeleteConfirmOpen(true)} content={<FormattedMessage id="delete" />} disabled={!skin.isEditable} />
    </div>
  );

  if (!isContextSet) {
    setControls(controls);
    setIsContextSet(true);
  }

  const handleSkinSaveAs = (data: any) => {
    const { name, isEditable, ...colors } = skin;

    createSkin({
      name: data.name,
      // @ts-ignore
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

  const pickerProps = (name: string, activeKey: string) => ({
    description: intl.formatMessage({ id: `${name}_description` }),
    title: intl.formatMessage({ id: `${name}_title` }),
    buttonText: intl.formatMessage({ id: `${name}_button` }),
    onClick: () => setActiveKey(activeKey),
  });

  const content = () => (
    <div className={styles.skinContainer}>
      {!activeKey && controls}
      {isSaveAsModalOpen && (
        <AddNew
          title={intl.formatMessage({ id: "save_skin_as" }, { name: skin.name })}
          fields={{ name: intl.formatMessage({ id: 'skin_copy' }, { name: skin.name }) }}
          onCancel={() => setIsSaveAsModalOpen(false)}
          onConfirm={(data: any) => handleSkinSaveAs(data)}
          confirmText='Save'
          cancelText='Cancel'
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
        <>
          {activeKey === 'preferences' && <SkinPreferences skin={skin} onClose={() => setActiveKey('')} />}
          {activeKey === 'colors' && <SkinColors skin={skin} onClose={() => setActiveKey('')} />}
          {activeKey === 'fonts' && <SkinFonts skin={skin} onClose={() => setActiveKey('')} />}
          {activeKey === 'graphics' && <SkinGraphics skin={skin} onClose={() => setActiveKey('')} />}
          {activeKey === 'lights' && <SkinLights skin={skin} onClose={() => setActiveKey('')} loadSkins={() => { }} />}
          {!activeKey && (
            <Picker
              applyPadding={false}
              items={[
                pickerProps('skin_preference', 'preferences'),
                pickerProps('skin_colors', 'colors'),
                pickerProps('skin_fonts', 'fonts'),
                pickerProps('skin_graphics', 'graphics'),
                pickerProps('skin_lighting', 'lights'),
              ]} />
          )}
        </>
      )}
    </div>
  );

  return content();
};

export default SkinDetail;
