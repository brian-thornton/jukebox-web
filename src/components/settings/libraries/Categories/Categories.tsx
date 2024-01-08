import { FC, useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import CategoryRow from '../CategoryRow/CategoryRow';
import { SettingsContext } from '../../../layout/SettingsProvider';
import { calculatePageSize } from '../../../../lib/helper/styleHelper';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import Button from '../../../common/Button/Button';

interface ICategories {
  onClose: Function,
};

const Categories: FC<ICategories> = ({ onClose }) => {
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  useEffect(() => setItemsPerPage(calculatePageSize('item')), []);
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  const items = settings?.categories?.slice(start, (start + itemsPerPage)).map(category => (
    // @ts-ignore
    <CategoryRow category={category} />
  ));

  return (
    <PaginatedList
      topLevelControls={<Button content={<FormattedMessage id="back_to_libraries" />} onClick={onClose} />}
      // @ts-ignore
      items={items}
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      totalItems={settings?.categories?.length || 0}
      itemsPerPage={itemsPerPage}
    />
  );
};

export default Categories;
