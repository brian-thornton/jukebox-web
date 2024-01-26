import { FC } from 'react';

import SideBySide from '../../layout/SideBySide/SideBySide';

interface IRadioCategoriesMobile {
  category: string,
  setCategory: Function,
  onClose: Function,
}

const RadioCategoriesMobile: FC<IRadioCategoriesMobile> = ({ setCategory, category, onClose }) => {
  const selectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
    onClose();
  };

  const actions = [
      { text: 'Rock', action: () => selectCategory('Rock')},
      { text: 'Pop', action: () => selectCategory('Pop')},
      { text: '70s', action: () => selectCategory('70s')},
      { text: '80s', action: () => selectCategory('80s')},
      { text: '90s', action: () => selectCategory('90s')},
      { text: 'Oldies', action: () => selectCategory('Oldies')},
      { text: 'Country', action: () => selectCategory('Country')}, 
      { text: 'Rap', action: () => selectCategory('Rap')},
      { text: 'Dance', action: () => selectCategory('Dance')}, 
  ];

  return <SideBySide data={actions} />;
};

export default RadioCategoriesMobile;
