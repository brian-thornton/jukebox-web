import { FC, useContext } from 'react';
import { useIntl } from 'react-intl';

import { SettingsContext } from '../../layout/SettingsProvider';
import SideBySide from '../../common/SideBySide/SideBySide';

interface IRadioCategoriesMobile {
  category: string,
  setCategory: Function,
  onClose: Function,
};

const RadioCategoriesMobile: FC<IRadioCategoriesMobile> = ({ setCategory, category, onClose }) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);

  const itemStyle = {
    background: settings?.styles?.trackBackgroundColor,
    color: settings?.styles?.fontColor,
    margin: '3px',
  }

  const selectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
    onClose();
  };

  const actions = [
    [
      { text: 'Rock', action: () => selectCategory('Rock'), style: itemStyle },
      { text: 'Pop', action: () => selectCategory('Pop'), style: itemStyle },
    ],
    [
      { text: '70s', action: () => selectCategory('70s'), style: itemStyle },
      { text: '80s', action: () => selectCategory('80s'), style: itemStyle },
    ],
    [
      { text: '90s', action: () => selectCategory('90s'), style: itemStyle },
      { text: 'Oldies', action: () => selectCategory('Oldies'), style: itemStyle },
    ],
    [
      { text: 'Country', action: () => selectCategory('Country'), style: itemStyle }, 
      { text: 'Rap', action: () => selectCategory('Rap'), style: itemStyle },
    ],
    [
      { text: 'Dance', action: () => selectCategory('Dance'), style: itemStyle }, 
    ]
  ]

  return (
    <SideBySide data={actions} />
  );
};

export default RadioCategoriesMobile;
