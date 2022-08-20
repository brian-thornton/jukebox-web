import { PropTypes } from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable'; 

import Paginator from '../../common/Paginator';
import SkinRow from './SkinRow';
import { handlers } from '../../../lib/gesture-helper';
import './SkinList.scss';

const propTypes = {
  resetControls: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
};

const SkinList = ({ skins, reloadSkins, onCopy, setEditSkin, setSelectedSkin }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

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
        <ListGroup className="skin-list-group" {...swipe}>
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