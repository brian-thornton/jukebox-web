import { PropTypes } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../Button';
import Item from '../../../common/Item/Item';
import { Skin } from '../../../shapes';

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
        <Button onClick={() => setEditSkin(skin)} content={<FormattedMessage id="edit" />} />
        <Button onClick={() => setSelectedSkin(skin)} content={<FormattedMessage id="use_skin" />} />
      </>
    )}
  />
);

SkinRow.propTypes = propTypes;

export default SkinRow;
