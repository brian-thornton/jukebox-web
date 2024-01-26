import { FC, useContext } from 'react';

import { SettingsContext } from '../../layout/SettingsProvider';
import Button from '../../common/Buttons/Button/Button';
import styles from './RadioCategories.module.css';

interface IRadioCategories {
  category: string,
  setCategory: Function,
}

const RadioCategories: FC<IRadioCategories> = ({ category, setCategory }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;
  const { controlButtonSize } = settings?.styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 50;

  const categories = [
    'Rock', 'Pop', '70s', '80s', '90s', 'Oldies', 'Country', 'Rap', 'Dance',
  ];

  return (
    <div className={styles.categoriesContainer}>
      {categories.map(c => (
        <Button
          disabled={features?.isLocked}
          onClick={() => {
            setCategory(c);
          }}
          isSelected={c === category}
          width="100%"
          height={buttonHeight.toString()}
          content={c}
        />
      ))}
    </div>
  );
};

export default RadioCategories;
