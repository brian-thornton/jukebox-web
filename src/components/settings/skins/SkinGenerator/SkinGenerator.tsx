import { FC, useState } from "react";

import ColorPaletteList from "../ColorPaletteList/ColorPaletteList";
import SkinPreview from "../SkinPreview/SkinPreview";

import styles from './SkinGenerator.module.css';

const SkinGenerator: FC = () => {
  const [selectedPalette, setSelectedPalette] = useState();

  return (
    <div className={styles.skinGeneratorContainer}>
      <div>
        <ColorPaletteList onSelect={(palette: any): any => setSelectedPalette(palette)} />
      </div>
      {selectedPalette && (
        <div className={styles.skinPreview}>
          <SkinPreview palette={selectedPalette} />
        </div>
      )}
    </div>
  )
};

export default SkinGenerator;