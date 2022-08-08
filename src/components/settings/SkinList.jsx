import { PropTypes } from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect, useContext } from 'react';

import Paginator from '../common/Paginator';
import SkinRow from './SkinRow';

const propTypes = {
  resetControls: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
};

const SkinList = ({ skins, reloadSkins, onCopy, setEditSkin, setSelectedSkin }) => {
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

  if (skins?.length) {
    return (
      <>
        <ListGroup style={{ width: '100%' }}>
          {skinRows()}
        </ListGroup>
        <Paginator
          disableRandom
          onPageChange={(page) => setSelectedPage(page)}
          selectedPage={selectedPage}
          totalItems={skins.length}
          pageSize={realPageSize}
        />
      </>
    );
  }

  return <></>;
}

SkinList.propTypes = propTypes;

export default SkinList;
