import {FC} from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../Button';
import Item from '../../../common/Item/Item';

import { ISkin } from '../../../interface';

interface ISkinRow {
  setEditSkin: Function,
  setSelectedSkin: Function,
  skin: ISkin,
}

const SkinRow: FC<ISkinRow> = ({ skin, setEditSkin, setSelectedSkin }) => (
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

export default SkinRow;
