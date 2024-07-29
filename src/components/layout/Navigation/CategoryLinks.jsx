import { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';

import { SettingsContext } from '../SettingsProvider';

const CategoryLinks = () => {
  const settings = useContext(SettingsContext);
  const { features } = settings;

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

export default CategoryLinks;
