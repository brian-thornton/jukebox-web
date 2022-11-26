import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect } from 'react';
import { TrashFill } from 'react-bootstrap-icons';

import Button from '../../Button';
import Paginator from '../../common/Paginator';
import { useSwipeable } from 'react-swipeable';
import { handlers } from '../../../lib/gesture-helper';
import { pageSize } from '../../../lib/styleHelper';
import Item from '../../common/Item';
import NoResults from '../../common/NoResults';
import { createRestrictionGroup, getRestrictionGroups, updateRestrictionGroup } from '../../../lib/settings-client';

const RestrictionModeDetail = ({ restrictionMode, onClose }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  useEffect(() => {
    setRealPageSize(pageSize('item', 300));
  }, []);

  const removeRestriction = (path) => {
    const deepClone = JSON.parse(JSON.stringify(restrictionMode));
    deepClone.content = deepClone.content.filter((p) => p !== path);
    updateRestrictionGroup(deepClone);
  };

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  return (
    <>
      {restrictionMode.content?.length === 0 && (
        <NoResults
          applyMargin={false}
          title="No Restrictions"
          text="No restrictions have been set for this group."
        />
      )}
      {restrictionMode.content?.length > 0 && (
        <>
          <Button content="Back to Restriction Groups" onClick={onClose} />
          <ListGroup {...swipe}>
            {restrictionMode.content?.slice(realStart, (realStart + realPageSize)).map((albumPath) => (
              <Item
                text={albumPath}
                buttons={(
                  <>
                    <Button
                      content={<TrashFill />}
                      onClick={() => removeRestriction(albumPath)}
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
            totalItems={restrictionMode.content.length}
            pageSize={realPageSize}
          />
        </>
      )}
    </>
  )
};

export default RestrictionModeDetail;