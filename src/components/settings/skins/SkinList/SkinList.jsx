import { PropTypes } from 'prop-types';
import React, { useState, useEffect } from 'react';

import SkinRow from '../SkinRow/SkinRow';
import './SkinList.scss';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import { Skins } from '../../../shapes';

const propTypes = {
  skins: Skins.isRequired,
  reloadSkins: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  setEditSkin: PropTypes.func.isRequired,
  setSelectedSkin: PropTypes.func.isRequired,
};

const SkinList = ({
  skins,
  reloadSkins,
  onCopy,
  setEditSkin,
  setSelectedSkin,
}) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  useEffect(() => {
    const itemHeight = 55;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  const skinRows = () => {
    if (skins && skins.length) {
      return skins.slice(realStart, (realStart + realPageSize)).map(skin => (
        <SkinRow
          skin={skin}
          reloadSkins={reloadSkins}
          onCopy={onCopy}
          setEditSkin={setEditSkin}
          setSelectedSkin={setSelectedSkin}
        />
      ));
    }

    return <></>;
  };

  if (skins && skins.length > 0) {
    return (
      <PaginatedList
        items={skinRows()}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        pageSize={realPageSize}
      />
    );
  }

  return <></>;
};

SkinList.propTypes = propTypes;

export default SkinList;
