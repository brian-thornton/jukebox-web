import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';

import Item from '../common/Item';
import Paginator from '../common/Paginator';

const ControllerPalettes = ({ controllerState, onSelect }) => {
  const [selectedPalettePage, setSelectedPalettePage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const paletteStart = selectedPalettePage === 1 ? 0 : ((selectedPalettePage * realPageSize) - realPageSize);

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  return (
    <>
      <ListGroup>
        {controllerState?.palettes.slice(paletteStart, (paletteStart + realPageSize)).map((palette) => (
          <Item
            text={`${palette} (Color Palette)`}
            onClick={() => {
              onSelect(palette);
            }}
          />
        ))}
      </ListGroup>
      <Paginator
        disableRandom
        onPageChange={(page) => setSelectedPalettePage(page)}
        selectedPage={selectedPalettePage}
        totalItems={controllerState?.palettes.length}
        pageSize={realPageSize}
      />
    </>
  );
}

export default ControllerPalettes;