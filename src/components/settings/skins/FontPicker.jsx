import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import Item from '../../common/Item';
import { calculatePageSize, supportedFonts } from '../../../lib/styleHelper';
import { deleteSkin, createSkin } from '../../../lib/style-client';
import PaginatedList from '../../common/PaginatedList';
import { Skin } from '../../shapes';
import Button from '../../Button';

const propTypes = {
  editFont: PropTypes.string.isRequired,
  skin: Skin.isRequired,
  onComplete: PropTypes.func.isRequired,
};

const FontPicker = ({ editFont, skin, onComplete, onCancel }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  const availableFonts = supportedFonts.google.families;
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  useEffect(() => setItemsPerPage(calculatePageSize('item', 350)), []);

  const updateFont = (fontName) => {
    deleteSkin(skin.name).then(() => {
      const newObject = {
        ...skin,
        [editFont]: fontName,
      };

      createSkin({
        name: newObject.name,
        skin: newObject,
      }).then(onComplete);
    });
  };

  const items = () => availableFonts.slice(start, (start + itemsPerPage)).map(f => (
    <Item
      checked={skin[editFont] === f}
      includeCheckbox
      onCheck={() => updateFont(f)}
      text={f}
      font={f}
    />
  ));

  return (
    <PaginatedList
      topLevelControls={<Button content={<FormattedMessage id="back_to_font_selection" />} onClick={() => onCancel()} />}
      items={items()}
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      totalItems={availableFonts.length}
      pageSize={itemsPerPage}
    />
  );
};

FontPicker.propTypes = propTypes;

export default FontPicker;
