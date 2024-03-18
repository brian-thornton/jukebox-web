import { useContext } from 'react';

import { SettingsContext } from '../SettingsProvider';
import Button from '../../common/Buttons/Button/Button';

const CategoryButtons = () => {
  const settings = useContext(SettingsContext);
  const { features } = settings;
  const { navButtonSize } = settings.styles;
  let height = navButtonSize === 'large' ? '100' : '35';
  let fontSize = navButtonSize === 'large' ? '40px' : '';

  if (navButtonSize === 'medium') {
    height = '70';
    fontSize = '30px';
  }

  return (
    <>
      {settings.categories.map(c => (
        <>
          {c !== 'Albums' && c.enabled === 'ON' && (
            <Button
              style={{
                fontSize,
                fontFamily: settings.buttonFont,
                marginTop: 0,
                marginBottom: 0,
              }}
              height={height}
              disabled={features.isLocked}
              content={c.category}
              onClick={() => window.location.replace(`/albums/categories/${c.category.replace(' ', '%20')}`)}
            />
          )}
        </>
      ))}
    </>
  )
};

export default CategoryButtons;
