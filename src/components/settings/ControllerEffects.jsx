import { ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useSwipeable } from 'react-swipeable';
import { FormattedMessage } from 'react-intl';

import Item from '../common/Item/Item';
import Paginator from '../common/Paginator/Paginator';
import { handlers } from '../../lib/helper/gesture-helper';
import { ControllerState } from '../shapes';
import { SettingsContext } from 'components/layout/SettingsProvider';

const propTypes = {
  controllerState: ControllerState.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const ControllerEffects = ({ controllerState, onSelect }) => {
  const settings = useContext(SettingsContext);
  const { rowPageSize } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const palletEffects = ['Palette', 'Colorwaves', 'BPM', 'Lake', 'Pacifica', 'Noise Pal', 'Flow', 'Blends', 'Dynamic Smooth'];
  const effectStart = selectedPage === 1 ? 0 : ((selectedPage * rowPageSize) - rowPageSize);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  return (
    <>
      <ListGroup {...swipe}>
        {controllerState?.effects.slice(effectStart, (effectStart + rowPageSize)).map((effect) => {
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
      />
    </>
  );
};

ControllerEffects.propTypes = propTypes;

export default ControllerEffects;
