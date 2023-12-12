import { FC, useContext } from 'react';

import { SettingsContext } from '../../layout/SettingsProvider';
import Button from '../../Button';
import styles from './RadioCategories.module.css';
import { bigButtons } from '../../../lib/helper/styleHelper';

interface IRadioCategories {
  category: string,
  setCategory: Function,
}

const RadioCategories: FC<IRadioCategories> = ({ category, setCategory }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;
  const { controlButtonSize } = settings?.styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 50;
  const fontSize = bigButtons(settings) ? '30px' : '';

  const categories = [
    'Rock', 'Pop', '70s', '80s', '90s', 'Oldies', 'Country', 'Rap', 'Dance',
  ];

  return (
    <div className={styles.categoriesContainer}>
      {categories.map(c => (
        <Button
          style={{ fontSize }}
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
