import { PropTypes } from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import Button from '../../Button';
import Item from '../../common/Item';
import { Skin } from '../../shapes';

const propTypes = {
  setEditSkin: PropTypes.func.isRequired,
  setSelectedSkin: PropTypes.func.isRequired,
  skin: Skin.isRequired,
};

const SkinRow = ({ intl, skin, setEditSkin, setSelectedSkin }) => (
  <Item
    text={skin.name}
    buttons={(
      <>
        <Button onClick={() => setEditSkin(skin)} content={intl.formatMessage({ id: 'edit' })} />
        <Button onClick={() => setSelectedSkin(skin)} content={intl.formatMessage({ id: 'use_skin' })} />
      </>
    )}
  />
);

SkinRow.propTypes = propTypes;

export default injectIntl(SkinRow);
