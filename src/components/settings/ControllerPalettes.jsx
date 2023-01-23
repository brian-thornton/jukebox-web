import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useSwipeable } from 'react-swipeable';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Item from '../common/Item';
import Paginator from '../common/Paginator';
import { handlers } from '../../lib/gesture-helper';
import { ControllerState } from '../shapes';

const propTypes = {
  controllerState: ControllerState.isRequired,
  onSelect: PropTypes.func.isRequired,
};

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

  const end = paletteStart + realPageSize;

  return (
    <>
      <ListGroup {...swipe}>
        {controllerState?.palettes.slice(paletteStart, end).map(palette => (
          <Item
            text={<FormattedMessage id="color_palette" values={{ palette }} />}
            onClick={() => {
              onSelect(palette);
            }}
          />
        ))}
      </ListGroup>
      <Paginator
        disableRandom
        onPageChange={page => setSelectedPage(page)}
        selectedPage={selectedPage}
        totalItems={controllerState?.palettes.length}
        pageSize={realPageSize}
      />
    </>
  );
};

ControllerPalettes.propTypes = propTypes;

export default ControllerPalettes;
