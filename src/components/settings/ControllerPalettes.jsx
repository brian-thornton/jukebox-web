import { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useSwipeable } from 'react-swipeable';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Item from '../common/Item/Item';
import Paginator from '../common/Paginator/Paginator';
import { handlers } from '../../lib/helper/gesture-helper';
import { ControllerState } from '../shapes';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  controllerState: ControllerState.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const ControllerPalettes = ({ controllerState, onSelect }) => {
  const settings = useContext(SettingsContext);
  const { rowPageSize } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const paletteStart = selectedPage === 1 ? 0 : ((selectedPage * rowPageSize) - rowPageSize);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  const end = paletteStart + rowPageSize;

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
      />
    </>
  );
};

ControllerPalettes.propTypes = propTypes;

export default ControllerPalettes;
