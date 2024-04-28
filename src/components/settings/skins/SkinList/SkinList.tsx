import { FC, useState, useContext } from 'react';

import SkinRow from '../SkinRow/SkinRow';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import { ISkin } from '../../../interface';
import { SettingsContext } from '../../../layout/SettingsProvider';

interface ISkinList {
  skins: Array<ISkin>,
  setEditSkin: Function,
  setSelectedSkin: Function,
}

const SkinList: FC<ISkinList> = ({
  skins,
  setEditSkin,
  setSelectedSkin,
}) => {
  const settings = useContext(SettingsContext);
  const { rowPageSize = 1 } = settings;
  const [selectedPage, setSelectedPage] = useState(1);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * rowPageSize) - rowPageSize);

  const skinRows = skins && skins.length > 0 ?
    skins.slice(realStart, (realStart + rowPageSize)).map(skin => (
      <SkinRow
        skin={skin}
        setEditSkin={setEditSkin}
        setSelectedSkin={setSelectedSkin}
      />
    )) : <></>;

  return skins && skins.length > 0 ? (
    <PaginatedList
      // @ts-ignore
      items={skinRows}
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      pageSize={rowPageSize}
      totalItems={skins.length}
    />
  ) : <></>;
};

export default SkinList;
