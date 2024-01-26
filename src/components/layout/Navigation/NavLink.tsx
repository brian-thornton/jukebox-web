import Nav from 'react-bootstrap/Nav';
import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import { SettingsContext } from '../SettingsProvider';

interface INavLink {
  feature: string,
}

const NavLink: FC<INavLink> = ({ feature }) => {
  const settings = useContext(SettingsContext);
  const { styles, features } = settings;
  const { headerFont } = styles || {};

  return (
    <Nav.Link
      disabled={features?.isLocked}
      style={{ fontFamily: headerFont, color: styles?.fontColor}}
      href={`/${feature}`}
    >
      <FormattedMessage id={feature} />
    </Nav.Link>
  );
};

export default NavLink;
