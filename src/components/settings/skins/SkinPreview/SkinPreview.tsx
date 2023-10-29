import { FC, useState } from "react";

import Button from "../../../Button";

import styles from './SkinPreview.module.css';
import Item from "../../../common/Item/Item";
import NameInput from "../../../common/NameInput/NameInput";
import { createSkin } from '../../../../lib/service-clients/style-client';

interface ISkinPreview {
  palette: any,
}

const SkinPreview: FC<ISkinPreview> = (palette) => {
  const [name, setName] = useState('Generated Skin');

  const handleSave = () => {
    const skin = {
      name,
      skin: {
        isEditable: true,
        name,
        headerColor: gradientString(palette.palette.colors[0], palette.palette.colors[4]),
        headerFont: "Bebas Neue",
        footerColor: gradientString(palette.palette.colors[0], palette.palette.colors[4]),
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
    }

    createSkin(skin);
  }

  const hexToRgb = (hex: any) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  const gradientString = (start: any, end: any) => {
    const startRgb = hexToRgb(start);
    const endRgb = hexToRgb(end);
    return `linear-gradient(180deg, rgba(${startRgb?.r}, ${startRgb?.g}, ${startRgb?.b}, 1) 0%, rgba(${endRgb?.r}, ${endRgb?.g}, ${endRgb?.b}, 1) 100%)`;
  };

  return (
    <div className={styles.previewContainer} style={{ background: palette.palette.colors[0] }}>
      <div style={{ background: gradientString(palette.palette.colors[0], palette.palette.colors[4]), height: '50px' }}>Header</div>
      <Button style={{ buttonBackgroundColor: palette.palette.colors[1] }} content="Test Button" />
      <Item text="Test Item" background={palette.palette.colors[2]} />
      <Item text="Test Item" background={palette.palette.colors[2]}/>
      <Item text="Test Item" background={palette.palette.colors[2]}/>
      <div style={{ background: gradientString(palette.palette.colors[0], palette.palette.colors[4]), height: '50px' }}>Footer</div>
      <div style={{ marginTop: '30px', width: '100%' }} >
        <Button style={{ buttonBackgroundColor: palette.palette.colors[1] }} width="100%" content="Save" onClick={handleSave} />
        <NameInput onChange={(event: any) => setName(event.target.value)}/>
      </div>
    </div>
  )
}

export default SkinPreview;