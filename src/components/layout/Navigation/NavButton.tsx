import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../common/Buttons/Button/Button';
import { SettingsContext } from '../SettingsProvider';

interface INavButton {
  content?: string,
  feature: string,
}

const NavButton: FC<INavButton> = ({ feature, content }) => {
  const settings = useContext(SettingsContext);
  const { styles, features } = settings;
  const { navButtonSize } = settings.styles || {};

  let height = '35';
  let fontSize = '';

  if (navButtonSize === 'large') {
    height = '100';
    fontSize = '40px';
  }

  if (navButtonSize === 'medium') {
    height = '70';
    fontSize = '30px';
  }

  return (
    <Button
      key={`${feature}-nav`}
      height={height}
      style={{
        fontSize,
        fontFamily: styles?.buttonFont,
        marginTop: '0',
        marginBottom: '0',
      }}
      isSelected={location.pathname === `/${feature}`}
      disabled={features?.isLocked}
      content={content ? content : <FormattedMessage id={feature} />}
      onClick={() => window.location.replace(`/${feature}`)}
    />
  )
};

export default NavButton;
