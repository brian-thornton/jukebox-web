import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { FC, useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../../../common/Buttons/Button/Button';
import { SettingsContext } from '../../../layout/SettingsProvider';
import { updateSettings } from '../../../../lib/service-clients/settings-client';
import styles from './CategoryPicker.module.css';
import { add } from 'lodash';

interface ICategoryPicker {
  selectedCategory?: string,
  onSelectCategory: Function,
  category: string,
}

const CategoryPicker: FC<ICategoryPicker> = ({
  category,
  onSelectCategory,
}) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState(settings.categories);
  const [addMode, setAddMode] = useState(false);

  const onAddCategory = () => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.categories.push({
      category: newCategory,
      enabled: true,
    });
    updateSettings(deepClone).then(() => {
      setCategories(deepClone.categories);
      setNewCategory('');
      setAddMode(false);
    });
  };

  return addMode ? (
    <div className={styles.pickerRow}>
      <Form.Label column sm="3" style={{ color: settings?.styles?.fontColor }}>
        <FormattedMessage id="new_category" />
      </Form.Label>
      <FormControl
        id="category"
        placeholder={intl.formatMessage({ id: 'new_category_name' })}
        aria-label="Name"
        defaultValue={newCategory}
        aria-describedby="basic-addon1"
        onChange={event => setNewCategory(event.target.value)}
      />
      <Button width='150' onClick={onAddCategory} content={<FormattedMessage id="save_new_category" />} />
      <Button width='100' onClick={() => setAddMode(false)} content={<FormattedMessage id="cancel" />} />
    </div>
  ) : (
    <div className={styles.pickerRow}>
      <div>
        Category
      </div>
      <select className={styles.categorySelect}>
        {categories?.map(category => <option onChange={e => onSelectCategory(e.target)}>{category.category}</option>)}
      </select>
      <Button onClick={() => setAddMode(true)} content={<FormattedMessage id="add_new_category" />} />
    </div>
  );
};

export default CategoryPicker;
