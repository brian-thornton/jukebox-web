import { useContext, useEffect, useState } from 'react';
import { ButtonGroup } from 'react-bootstrap';

import { SettingsContext } from '../../../layout/SettingsProvider';
import { calculatePageSize } from '../../../../lib/helper/styleHelper';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import Button from '../../../common/Buttons/Button/Button';
import CategoryDetail from '../CategoryDetail/CategoryDetail';
import { updateSettings } from '../../../../lib/service-clients/settings-client';

const CategoryList = () => {
  const settings = useContext(SettingsContext);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState();
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);
  useEffect(() => setItemsPerPage(calculatePageSize('item', 250, 60)), []);

  const onSetKey = (cateogry, key) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const { categories } = deepClone;
    const targetCategory = categories.find(c => c.category === cateogry.category);
    targetCategory.enabled = key;
    updateSettings(deepClone);
    window.location.reload();
  };

  const items = () => (
    settings.categories.slice(realStart, (realStart + itemsPerPage)).map(category => (
      {
        text: category.category,
        buttons: (
          <>
            <ButtonGroup>
              {['ON', 'OFF'].map(key => (
                <Button
                  onClick={() => onSetKey(category, key)}
                  isToggle
                  isToggled={category.enabled === key}
                  content={key}
                />
              ))}
            </ButtonGroup>
            <Button content="Edit" onClick={() => setSelectedCategory(category)} />
          </>
        ),
      }
    ))
  );

  return selectedCategory ? (
    <CategoryDetail
      category={selectedCategory}
      setCategory={setSelectedCategory}
      onClose={() => setSelectedCategory(null)}
    />
  ) : (
    <PaginatedList
      items={items()}
      totalItems={settings.categories.length}
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      pageSize={itemsPerPage}
    />
  );
};

export default CategoryList;
