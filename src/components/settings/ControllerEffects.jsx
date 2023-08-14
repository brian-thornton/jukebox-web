import { ListGroup } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useSwipeable } from 'react-swipeable';
import { FormattedMessage } from 'react-intl';

import Item from '../common/Item/Item';
import Paginator from '../common/Paginator/Paginator';
import { handlers } from '../../lib/gesture-helper';
import { ControllerState } from '../shapes';

const propTypes = {
  controllerState: ControllerState.isRequired,
  onSelect: PropTypes.func.isRequired,
};

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
          const effectType = palletEffects.includes(effect) ? <FormattedMessage id="effect_with_palette" /> : <FormattedMessage id="effect" />;

          return (
            <Item
              text={`${effect} ${effectType}`}
              onClick={() => onSelect(effect)}
            />
          );
        })}
      </ListGroup>
      <Paginator
        disableRandom
        onPageChange={page => setSelectedPage(page)}
        selectedPage={selectedPage}
        totalItems={controllerState?.effects.length}
        pageSize={realPageSize}
      />
    </>
  );
};

ControllerEffects.propTypes = propTypes;

export default ControllerEffects;
