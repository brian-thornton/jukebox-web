import { FC, useContext, useEffect, useState } from 'react';

import { SettingsContext } from '../../../layout/SettingsProvider';
import NameInput from '../../../common/NameInput/NameInput';
import Button from '../../../common/Buttons/Button/Button';
import { getByCategory } from '../../../../lib/service-clients/librarian-client';
import PaginatedList from '../../../common/PaginatedList/PaginatedList';
import Item from '../../../common/Item/Item';
import {
  add,
  getLibraries,
  deleteLibrary,
} from '../../../../lib/service-clients/librarian-client';

import { ILibrary } from '../../../interface';
import styles from './CategoryDetail.module.css'

interface ICategoryDetail {
  category: {
    category: string,
  },
  setCategory: Function,
  onClose: Function,
}

const CategoryDetail: FC<ICategoryDetail> = ({ category, onClose }) => {
  const settings = useContext(SettingsContext);
  const { rowPageSize = 1 } = settings;
  const [updatedCategory, setUpdatedCategory] = useState({ name: category });
  const [categoryLibs, setCategoryLibs] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const realStart = selectedPage === 1 ? 0 : ((selectedPage * rowPageSize) - rowPageSize);

  const onRemoveFromCategory = async (library: ILibrary) => {
    const libraries = await getLibraries();
    const targetLibrary = libraries.find((l: ILibrary) => l.name === library.name);
    targetLibrary.category = '';
    await deleteLibrary(targetLibrary.name);
    await add(targetLibrary);
  };

  const items = () => (
    categoryLibs.slice(realStart, (realStart + rowPageSize)).map((library: ILibrary) => (
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
    });
  };

  useEffect(() => loadCategory(), []);

  return (
    <div className={styles.categoryDetailContainer}>
      <Button content="Cancel" onClick={onClose} />
      <NameInput
        defaultValue={category.category}
        onChange={(e: any) => setUpdatedCategory({ ...updatedCategory, name: e.target.value })}
      />
      <PaginatedList
        items={items()}
        totalItems={settings?.categories?.length}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        pageSize={rowPageSize}
        onItemClick={() => {}}
      />
    </div>
  )
};

export default CategoryDetail;
