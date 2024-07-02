import { useContext } from 'react';

import { SettingsContext } from '../SettingsProvider';
import Button from '../../common/Buttons/Button/Button';

const CategoryButtons = () => {
  const settings = useContext(SettingsContext);
  const { features } = settings;

  return (
    <>
      {settings.categories.map(c => (
        <>
          {c !== 'Albums' && c.enabled === 'ON' && (
            <Button
              style={{
                fontSize: '30px',
                fontFamily: settings.buttonFont,
                marginTop: 0,
                marginBottom: 0,
              }}
              height={35}
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
