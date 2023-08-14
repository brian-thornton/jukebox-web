import { FC, useContext, useState } from 'react';
import {
  Trash,
} from 'react-bootstrap-icons';

import { SettingsContext } from '../../../layout/SettingsProvider';
import InRowDeleteConfirmation from '../../../common/InRowDeleteConfirmation/InRowDeleteConfirmation';
import Button from '../../../Button';
import Item from '../../../common/Item/Item';
import { updateSettings } from '../../../../lib/settings-client';

interface ICategoryRow {
  category: string,
};

const CategoryRow: FC<ICategoryRow> = ({ category }) => {
  const settings = useContext(SettingsContext);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState('');

  const removeCategory = async (categoryToRemove: any) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.categories = deepClone.categories.filter((c: any) => c !== categoryToRemove);
    await updateSettings(deepClone);
    window.location.reload();
  };

  return (
    <Item
      actionVisible={deleteConfirmCategory ? true : false}
      text={category}
      buttons={(
        <>
          {deleteConfirmCategory === category && (
            <InRowDeleteConfirmation
              onCancel={() => setDeleteConfirmCategory('')}
              onConfirm={() => removeCategory(category)}
            />
          )}
          {deleteConfirmCategory !== category && (
            <>
              <Button
                disabled={category === 'Albums'}
                onClick={() => setDeleteConfirmCategory(category)}
                content={<Trash />}
              />
            </>
          )}
        </>
      )}
    />
  );
};

export default CategoryRow;
