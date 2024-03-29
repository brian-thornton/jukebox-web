import { FC, useState, useEffect } from 'react';

import SkinRow from '../SkinRow/SkinRow';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import { ISkin } from '../../../interface';

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
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(Number);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  const skinRows = skins && skins.length > 0 ?
    skins.slice(realStart, (realStart + realPageSize)).map(skin => (
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
      pageSize={realPageSize}
      totalItems={skins.length}
    />
  ) : <></>;
};

export default SkinList;
