import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../common/Buttons/Button/Button';
import Item from '../../../common/Item/Item';
import styles from './SkinRow.module.css'

import { ISkin } from '../../../interface';

interface ISkinRow {
  setEditSkin: Function,
  setSelectedSkin: Function,
  skin: ISkin,
}

const SkinRow: FC<ISkinRow> = ({ skin, setEditSkin, setSelectedSkin }) => (
  <div className={styles.skinRowContainer}>
    {skin.name}
    <div>
      <Button onClick={() => setEditSkin(skin)} content={<FormattedMessage id="edit" />} />
      <Button onClick={() => setSelectedSkin(skin)} content={<FormattedMessage id="use_skin" />} />
    </div>
  </div>

  // <Item
  //   text={skin.name}
  //   buttons={(
  //     <>
  //       <Button onClick={() => setEditSkin(skin)} content={<FormattedMessage id="edit" />} />
  //       <Button onClick={() => setSelectedSkin(skin)} content={<FormattedMessage id="use_skin" />} />
  //     </>
  //   )}
  // />
);

export default SkinRow;
