import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import {
  Trash,
} from 'react-bootstrap-icons';
import { injectIntl } from 'react-intl';
import { ButtonGroup } from 'react-bootstrap';

import { SettingsContext } from '../../layout/SettingsProvider';
import InRowDeleteConfirmation from '../../common/InRowDeleteConfirmation';
import Button from '../../Button';
import Item from '../../common/Item';
import { updateSettings } from '../../../lib/settings-client';

const propTypes = {
  category: PropTypes.string.isRequired,
};

const CategoryRow = ({ category }) => {
  const settings = useContext(SettingsContext);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState();

  const removeCategory = async (categoryToRemove) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.categories = deepClone.categories.filter(c => c !== categoryToRemove);
    await updateSettings(deepClone);
    window.location.reload();
  };

  return (
    <Item
      actionVisible={deleteConfirmCategory}
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
  );
};

CategoryRow.propTypes = propTypes;

export default injectIntl(CategoryRow);
