import { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';

import { SettingsContext } from '../SettingsProvider';

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
            <Nav.Link
              disabled={features.isLocked}
              style={{ fontFamily: styles.headerFont }}
              href={`/albums/categories/${c.category.replace(' ', '%20')}`}
            >
              {c.category}
            </Nav.Link>
          )
          }
        </>
      ))}
    </>
  )
};

export default CategoryButtons;
