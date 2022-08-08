import { ListGroup } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

import Item from '../common/Item';
import Paginator from '../common/Paginator';

const ControllerEffects = ({ controllerState, onSelect }) => {
  const [selectedEffectPage, setSelectedEffectPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const palletEffects = ['Palette', 'Colorwaves', 'BPM', 'Lake', 'Pacifica', 'Noise Pal', 'Flow', 'Blends', 'Dynamic Smooth'];
  const effectStart = selectedEffectPage === 1 ? 0 : ((selectedEffectPage * realPageSize) - realPageSize);

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  return (
    <>
      <ListGroup>
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
        onPageChange={(page) => setSelectedEffectPage(page)}
        selectedPage={selectedEffectPage}
        totalItems={controllerState?.effects.length}
        pageSize={realPageSize}
      />
    </>
  );
}

export default ControllerEffects;