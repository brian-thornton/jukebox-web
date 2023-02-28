import React, { useContext, useEffect, useState } from 'react';

import { SettingsContext } from '../../layout/SettingsProvider';
import { calculatePageSize } from '../../../lib/styleHelper';
import PaginatedList from '../../common/PaginatedList';
import Button from '../../Button';
import CategoryDetail from './CategoryDetail';

const CategoryList = () => {
  const settings = useContext(SettingsContext);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState();
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);
  useEffect(() => setItemsPerPage(calculatePageSize('item', 250, 60)), []);

  const items = () => (
    settings.categories.slice(realStart, (realStart + itemsPerPage)).map(category => (
      {
        text: category,
        buttons: <Button content="Edit" onClick={() => setSelectedCategory(category)} />,
      }
    ))
  );

  return (
    <>
      {selectedCategory && (
        <CategoryDetail
          category={selectedCategory}
          setCategory={setSelectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
      {!selectedCategory && (
        <PaginatedList
          items={items()}
          totalItems={settings.categories.length}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pageSize={itemsPerPage}
        />
      )}
    </>
  );
};

export default CategoryList;
