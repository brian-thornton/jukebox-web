import { FC, useEffect, useState, useMemo } from 'react';

import { generateComplementaryColorPalettes, shuffle } from '../../../../lib/helper/palette';
import Paginator from '../../../common/Paginator/Paginator';

import styles from './ColorPaletteList.module.css';

interface IColorPaletteList {
  onSelect: (palette: any) => {};
}

interface ColorPalette {
  colors: string[];
}

const ColorPaletteList: FC<IColorPaletteList> = ({ onSelect }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(Number);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  const colorPallets = useMemo(() => generateComplementaryColorPalettes(1000), []);

  useEffect(() => {
    const itemHeight = 35;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  const onClick = (palette: any) => {
    palette.colors = shuffle(palette.colors);

    const obj = {
      colors: shuffle(palette.colors),
    }

    onSelect(obj);
  };

  const colorPalletPanels = (
    <div className={styles.paletteContainer}>
      {colorPallets.slice(realStart, (realStart + realPageSize)).map((colorPallet: ColorPalette) => (
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
        selectedPage={selectedPage}
        totalItems={colorPallets.length}
        pageSize={realPageSize}
      />
    </>
  );
};

export default ColorPaletteList;
