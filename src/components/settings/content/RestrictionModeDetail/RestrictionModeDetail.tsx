import { FC, useState, useEffect } from 'react';
import { TrashFill } from 'react-bootstrap-icons';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../../../Button';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import { calculatePageSize } from '../../../../lib/helper/styleHelper';
import NoResults from '../../../common/NoResults/NoResults';
import { updateRestrictionGroup } from '../../../../lib/service-clients/settings-client';
import { IRestrictionMode } from '../../../interface';

interface IRestrictionModeDetail {
  restrictionMode: IRestrictionMode,
  onClose: Function,
}

const RestrictionModeDetail: FC<IRestrictionModeDetail> = ({ restrictionMode, onClose }) => {
  const intl = useIntl();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState(0);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  useEffect(() => setRealPageSize(calculatePageSize('item', 300)), []);

  const removeRestriction = (path: string) => {
    const deepClone = JSON.parse(JSON.stringify(restrictionMode));
    deepClone.content = deepClone.content.filter((p: any) => p !== path);
    updateRestrictionGroup(deepClone);
  };

  const items = () => (
    restrictionMode.content?.slice(realStart, (realStart + realPageSize)).map(albumPath => (
      {
        text: albumPath,
        buttons: (
          <Button
            content={<TrashFill />}
            onClick={() => removeRestriction(albumPath)}
          />
        ),
      }
    ))
  );

  return (
    <>
      {restrictionMode.content?.length < 1 && (
        <NoResults
          applyMargin={false}
          title={intl.formatMessage({ id: "no_restrictions_title" })}
          text={intl.formatMessage({ id: "no_restrictions_text" })}
          onGoBack={onClose}
        />
      )}
      {restrictionMode.content?.length > 0 && (
        <PaginatedList
          topLevelControls={<Button content={<FormattedMessage id="back_to_restriction_groups" />} onClick={onClose} />}
          items={items()}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={realPageSize}
          onItemClick={() => { }}
        />
      )}
    </>
  );
};

export default RestrictionModeDetail;
