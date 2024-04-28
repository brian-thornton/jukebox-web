import { FC, useState, useMemo, useContext } from 'react';

import { generateComplementaryColorPalettes, shuffle } from '../../../../lib/helper/palette';
import Paginator from '../../../common/Paginator/Paginator';

import styles from './ColorPaletteList.module.css';
import { SettingsContext } from 'components/layout/SettingsProvider';

interface IColorPaletteList {
  onSelect: (palette: any) => {};
}

interface ColorPalette {
  colors: string[];
}

const ColorPaletteList: FC<IColorPaletteList> = ({ onSelect }) => {
  const settings = useContext(SettingsContext);
  const { rowPageSize = 1 } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * rowPageSize) - rowPageSize);
  const colorPallets = useMemo(() => generateComplementaryColorPalettes(1000), []);

  const onClick = (palette: any) => {
    palette.colors = shuffle(palette.colors);

    const obj = {
      colors: shuffle(palette.colors),
    }

    onSelect(obj);
  };

  const colorPalletPanels = (
    <div className={styles.paletteContainer}>
      {colorPallets.slice(realStart, (realStart + rowPageSize)).map((colorPallet: ColorPalette) => (
        <div className={styles.colorsContainer}>
          {colorPallet.colors.map((color: string) => (
            <div className={styles.color} style={{ backgroundColor: color }} onClick={() => onClick(colorPallet)} />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {colorPalletPanels}
      <Paginator
        disableRandom
        onPageChange={(page: any) => setSelectedPage(page)}
        totalItems={colorPallets.length}
      />
    </>
  );
};

export default ColorPaletteList;
