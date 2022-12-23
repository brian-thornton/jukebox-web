import React, { useState, useEffect } from 'react';
import { TrashFill } from 'react-bootstrap-icons';
import { PropTypes } from 'prop-types';

import Button from '../../Button';
import PaginatedList from '../../common/PaginatedList';
import { calculatePageSize } from '../../../lib/styleHelper';
import NoResults from '../../common/NoResults';
import { updateRestrictionGroup } from '../../../lib/settings-client';
import { RestrictionMode } from '../../shapes';

const propTypes = {
  restrictionMode: RestrictionMode.isRequired,
  onClose: PropTypes.func.isRequired,
};

const RestrictionModeDetail = ({ restrictionMode, onClose }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  useEffect(() => setRealPageSize(calculatePageSize('item', 300)), []);

  const removeRestriction = (path) => {
    const deepClone = JSON.parse(JSON.stringify(restrictionMode));
    deepClone.content = deepClone.content.filter(p => p !== path);
    updateRestrictionGroup(deepClone);
  };

  const items = () => (
    restrictionMode.content?.slice(realStart, (realStart + realPageSize)).map(albumPath => (
      {
        text: albumPath,
        buttons: (
          <>
            <Button
              content={<TrashFill />}
              onClick={() => removeRestriction(albumPath)}
            />
          </>
        ),
      }
    ))
  );

  return (
    <>
      {restrictionMode.content?.length === 0 && (
        <NoResults
          applyMargin={false}
          title="No Restrictions"
          text="No restrictions have been set for this group."
          goBackText="Go Back"
          onGoBack={onClose}
        />
      )}
      {restrictionMode.content?.length > 0 && (
        <PaginatedList
          topLevelControls={<Button content="Back to Restriction Groups" onClick={onClose} />}
          items={items()}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={realPageSize}
        />
      )}
    </>
  );
};

RestrictionModeDetail.propTypes = propTypes;

export default RestrictionModeDetail;
