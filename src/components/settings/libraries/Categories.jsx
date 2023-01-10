import React, { useContext, useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';

import CategoryRow from './CategoryRow';
import { SettingsContext } from '../../layout/SettingsProvider';
import { calculatePageSize } from '../../../lib/styleHelper';
import PaginatedList from '../../common/PaginatedList';
import Button from '../../Button';

const Categories = ({ intl, onClose }) => {
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  useEffect(() => setItemsPerPage(calculatePageSize('item')), []);
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  const items = settings.categories.slice(start, (start + itemsPerPage)).map(category => (
    <CategoryRow category={category} />
  ));

  return (
    <PaginatedList
      topLevelControls={<Button content={intl.formatMessage({ id: 'back_to_libraries' })} onClick={onClose} />}
      items={items}
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      totalItems={settings.categories.length}
      itemsPerPage={itemsPerPage}
    />
  )
};

export default injectIntl(Categories);
