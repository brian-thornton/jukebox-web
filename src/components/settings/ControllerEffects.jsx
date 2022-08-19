import { ListGroup } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

import Item from '../common/Item';
import Paginator from '../common/Paginator';
import { useSwipeable } from 'react-swipeable';
import { handlers } from '../../lib/gesture-helper';

const ControllerEffects = ({ controllerState, onSelect }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const palletEffects = ['Palette', 'Colorwaves', 'BPM', 'Lake', 'Pacifica', 'Noise Pal', 'Flow', 'Blends', 'Dynamic Smooth'];
  const effectStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  return (
    <>
      <ListGroup {...swipe}>
        {controllerState?.effects.slice(effectStart, (effectStart + realPageSize)).map((effect) => {
          const effectType = palletEffects.includes(effect) ? '(Effect with Palette)' : '(Effect)';

          return (
            <Item
              text={`${effect} ${effectType}`}
              onClick={() => onSelect(effect)}
            />
          )
        })}
      </ListGroup>
      <Paginator
        disableRandom
        onPageChange={(page) => setSelectedPage(page)}
        selectedPage={selectedPage}
        totalItems={controllerState?.effects.length}
        pageSize={realPageSize}
      />
    </>
  );
}

export default ControllerEffects;