import ListGroup from 'react-bootstrap/ListGroup';
import React, { useEffect, useState } from 'react';
import {
  PencilSquare,
  Search,
  Trash,
} from 'react-bootstrap-icons';

import Button from '../../Button';
import Paginator from '../../common/Paginator';
import { useSwipeable } from 'react-swipeable';
import { handlers } from '../../../lib/gesture-helper';
import { pageSize } from '../../../lib/styleHelper';
import Item from '../../common/Item';

const RestrictionModes = ({ }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [selectedRestrictionMode, setSelectedRestrictionMode] = useState();
  const restrictionModes = ['Unrestricted', 'Kids Party', 'Mixed Company'];
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  useEffect(() => setRealPageSize(pageSize('item', 300)), []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  return (
    <>
      <ListGroup {...swipe}>
        {restrictionModes.slice(realStart, (realStart + realPageSize)).map((restrictionMode) => (
          <Item
            text={restrictionMode}
            buttons={(
              <>
                <Button
                  onClick={() => setSelectedRestrictionMode(restrictionMode)}
                  content={<PencilSquare />}
                />
              </>
            )}
          />
        )
        )}
      </ListGroup>
      <Paginator
        disableRandom
        onPageChange={(page) => setSelectedPage(page)}
        selectedPage={selectedPage}
        totalItems={restrictionModes.length}
        pageSize={realPageSize}
      />
    </>
  );
}

export default RestrictionModes;
