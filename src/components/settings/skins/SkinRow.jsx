import { PropTypes } from 'prop-types';
import React from 'react';

import Button from '../../Button';
import Item from '../../common/Item';
import { Skin } from '../../shapes';

const propTypes = {
  setEditSkin: PropTypes.func.isRequired,
  setSelectedSkin: PropTypes.func.isRequired,
  skin: Skin.isRequired,
};

const SkinRow = ({ skin, setEditSkin, setSelectedSkin }) => (
  <Item
    text={skin.name}
    buttons={(
      <>
        <Button onClick={() => setEditSkin(skin)} content="Edit" />
        <Button onClick={() => setSelectedSkin(skin)} content="Use Skin" />
      </>
    )}
  />
);

SkinRow.propTypes = propTypes;

export default SkinRow;
