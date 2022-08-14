import React, { useContext, useState } from 'react';
import {
  Trash,
} from 'react-bootstrap-icons';

import { SettingsContext } from '../../layout/SettingsProvider';
import InRowDeleteConfirmation from '../../common/InRowDeleteConfirmation';
import Button from '../../Button';
import Item from '../../common/Item';
import { updateSettings } from '../../../lib/settings-client';

const CategoryRow = ({ category }) => {
  const settings = useContext(SettingsContext);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState();

  const removeCategory = async (category) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.categories = deepClone.categories.filter((c) => c !== category);
    await updateSettings(deepClone);
    window.location.reload();
  };

  return (
    <Item
      text={category}
      buttons={(
        <>
          {deleteConfirmCategory === category && (
            <InRowDeleteConfirmation
              onCancel={() => setDeleteConfirmCategory(null)}
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
  )
}

export default CategoryRow;
