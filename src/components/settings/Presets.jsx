import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '../common/Buttons/Button/Button';
import { calculatePageSize } from '../../lib/helper/styleHelper';
import Item from '../common/Item/Item';
import { applyPreset, getPresets, getCurrentState } from '../../lib/service-clients/lighting-client';
import PaginatedList from '../common/PaginatedList/PaginatedList';
import { Controller } from '../shapes';

const propTypes = {
  controller: Controller.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Presets = ({ controller, onClose, onSelect }) => {
  const [presets, setPresets] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();

  const loadPresets = () => {
    setRealPageSize(calculatePageSize('item', 350));

    getCurrentState(controller.ip);

    getPresets(controller.ip).then((data) => {
      setPresets(Object.keys(data).map(key => data[key]).filter(p => p.n));
    });
  };

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  useEffect(loadPresets, []);

  const items = () => presets.slice(realStart, (realStart + realPageSize)).map(preset => (
    <Item
      text={preset.n}
      buttons={(
        <>
          <Button
            onClick={() => {
              applyPreset(controller.ip, preset.n);
              onSelect(preset);
            }}
            content={<FormattedMessage id="enable" />}
          />
        </>
      )}
    />
  ));

  return (
    <>
      {presets?.length > 0 && (
        <PaginatedList
          topLevelControls={<Button content={<FormattedMessage id="back_to_controller_events" />} onClick={onClose} />}
          items={items()}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={realPageSize}
          totalItems={presets.length}
        />
      )}
    </>
  );
};

Presets.defaultProps = {
  onSelect: () => { },
};

Presets.propTypes = propTypes;

export default Presets;
