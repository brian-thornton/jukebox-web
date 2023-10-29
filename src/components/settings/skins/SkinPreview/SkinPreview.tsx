import { FC, useState } from "react";

import Button from "../../../Button";

import styles from './SkinPreview.module.css';
import Item from "../../../common/Item/Item";
import NameInput from "../../../common/NameInput/NameInput";
import { createSkin } from '../../../../lib/service-clients/style-client';
import { gradientString } from '../../../../lib/helper/palette';

interface ISkinPreview {
  palette: any,
}

const SkinPreview: FC<ISkinPreview> = (palette) => {
  const [name, setName] = useState('Generated Skin');
  const headerColor = gradientString(palette.palette.colors[0], palette.palette.colors[4]);
  const footerColor = gradientString(palette.palette.colors[0], palette.palette.colors[4]);

  const handleSave = () => {
    const skin = {
      name,
      skin: {
        isEditable: true,
        name,
        headerColor,
        headerFont: "Bebas Neue",
        footerColor,
        fontColor: "#FFFFFF",
        fontWeight: "normal",
        backgroundColor: palette.palette.colors[0],
        popupBackgroundColor: palette.palette.colors[0],
        buttonBackgroundColor: palette.palette.colors[1],
        activeButtonColor: palette.palette.colors[1],
        buttonFont: "Bebas Neue",
        buttonFontColor: "#FFFFFF",
        buttonFontWeight: "bold",
        trackBackgroundColor: palette.palette.colors[2],
        listFont: "Zen Dots",
        navButtonType: 'buttons',
        navButtonSize: 'small',
        controlButtonSize: 'small',
        buttonShape: 'rectangle',
        controlUseBackground: false,
      }
    };

    createSkin(skin);
  };

  return (
    <div className={styles.previewContainer} style={{ background: palette.palette.colors[0] }}>
      <div style={{ background: headerColor, height: '50px' }}>Header</div>
      <Button style={{ buttonBackgroundColor: palette.palette.colors[1] }} content="Test Button" />
      <Item text="Test Item" background={palette.palette.colors[2]} />
      <Item text="Test Item" background={palette.palette.colors[2]}/>
      <Item text="Test Item" background={palette.palette.colors[2]}/>
      <div style={{ background: footerColor, height: '50px' }}>Footer</div>
      <div style={{ marginTop: '30px', width: '100%' }} >
        <Button style={{ buttonBackgroundColor: palette.palette.colors[1] }} width="100%" content="Save" onClick={handleSave} />
        <NameInput onChange={(event: any) => setName(event.target.value)}/>
      </div>
    </div>
  )
}

export default SkinPreview;