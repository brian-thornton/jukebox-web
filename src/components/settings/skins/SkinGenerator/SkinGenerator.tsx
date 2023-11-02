import { FC, useEffect, useState } from "react";

import ColorPaletteList from "../ColorPaletteList/ColorPaletteList";
import SkinPreview from "../SkinPreview/SkinPreview";

const SkinGenerator: FC = () => {
  const [selectedPalette, setSelectedPalette] = useState();

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <ColorPaletteList onSelect={(palette: any): any => setSelectedPalette(palette)} />
      </div>
      {selectedPalette && (
        <div style={{ width: '50vw' }}>
          <SkinPreview palette={selectedPalette} />
        </div>
      )}
    </div>
  )
};

export default SkinGenerator;