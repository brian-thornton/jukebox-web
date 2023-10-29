import { FC, useMemo } from 'react';

import { generateComplementaryColorPalettes, shuffle } from '../../../../lib/helper/palette';
import styles from './ColorPaletteList.module.css';

interface IColorPaletteList {
  onSelect: (palette: any) => {};
}

interface ColorPalette {
  colors: string[];
}

const ColorPaletteList: FC<IColorPaletteList> = ({ onSelect }) => {
  const colorPallets = useMemo(() => generateComplementaryColorPalettes(100), []);

  const onClick = (palette: any) => {
    palette.colors = shuffle(palette.colors);

    const obj = {
      colors: shuffle(palette.colors),
    }

    onSelect(obj);
  };

  return (
    <div className={styles.paletteContainer}>
      {colorPallets.map((colorPallet: ColorPalette) => (
        <div className={styles.colorsContainer}>
          {colorPallet.colors.map((color: string) => (
            <div className={styles.color} style={{ backgroundColor: color }} onClick={() => onClick(colorPallet)} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ColorPaletteList;
