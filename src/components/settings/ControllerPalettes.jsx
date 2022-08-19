import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';

import Item from '../common/Item';
import Paginator from '../common/Paginator';
import { useSwipeable } from 'react-swipeable';
import { handlers } from '../../lib/gesture-helper';

const ControllerPalettes = ({ controllerState, onSelect }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const paletteStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  return (
    <>
      <ListGroup {...swipe}>
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
        onPageChange={(page) => setSelectedPage(page)}
        selectedPage={selectedPage}
        totalItems={controllerState?.palettes.length}
        pageSize={realPageSize}
      />
    </>
  );
}

export default ControllerPalettes;