import { FC, useContext, useEffect, useState } from 'react';

import { SettingsContext } from '../../layout/SettingsProvider';
import { calculatePageSize } from '../../../lib/styleHelper';
import NameInput from '../../common/NameInput';
import Button from '../../Button';
import { getByCategory } from '../../../lib/librarian-client';
import PaginatedList from '../../common/PaginatedList';
import Item from '../../common/Item';
import {
  add,
  getLibraries,
  discover,
  deleteLibrary,
  scan,
  
} from '../../../lib/librarian-client';

const CategoryDetail = ({ category, setCategory, onClose }) => {
  const settings = useContext(SettingsContext);
  const [updatedCategory, setUpdatedCategory] = useState({ name: category });
  const [categoryLibs, setCategoryLibs] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [realPageSize, setRealPageSize] = useState(0);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  useEffect(() => setItemsPerPage(calculatePageSize('item', 250, 60)), []);
  useEffect(() => setRealPageSize(calculatePageSize('item', 300)), []);

  const onRemoveFromCategory = async (library) => {
    const libraries = await getLibraries();
    const targetLibrary = libraries.find(l => l.name === library.name);
    targetLibrary.category = '';
    await deleteLibrary(targetLibrary.name);
    await add(targetLibrary);
  };

  const items = () => (
    categoryLibs.slice(realStart, (realStart + realPageSize)).map(library => (
      <Item
        text={library.name}
        buttons={(
            <Button
              onClick={() => onRemoveFromCategory(library)}
              content="Remove"
            />
        )}
      />
    ))
  );

  const loadCategory = () => {
    getByCategory(category.category).then((data) => {
      setCategoryLibs(data);
      console.log(data);
    });
  };

  useEffect(() => loadCategory(), []);

  return (
    <>
      <Button content="Cancel" onClick={onClose} />
      <NameInput
        defaultValue={category.category}
        onChange={(e) => setUpdatedCategory({ ...updatedCategory, name: e.target.value })}
      />
      <PaginatedList
        items={items()}
        totalItems={settings.categories.length}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        pageSize={itemsPerPage}
      />
    </>
  )
};

export default CategoryDetail;

