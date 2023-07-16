import { FC, useContext } from 'react';
import { Search, X } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import './Jukebox.scss';
import { SettingsContext } from './SettingsProvider';

interface IJukeboxNavSearchButtons {
  setSearch: Function,
  search: string,
  clearSearch: Function,
  lastModule: string,
};

const JukeboxNavSearchButtons: FC<IJukeboxNavSearchButtons> = ({ search, setSearch, clearSearch, lastModule }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;
  const navigate = useNavigate();
  const { navButtonSize } = settings.styles || {};
  const applyWidth = (navButtonSize === 'large' || navButtonSize === 'medium');
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

  const searchButton = (
    <Button
      width={applyWidth ? height : ''}
      height={height}
      disabled={features?.isLocked}
      onClick={() => {
        setSearch('');
        navigate('/search');
      }}
      content={<Search style={{ fontSize }} />}
    />
  );

  if (search) {
    return (
      <>
        <Button
          width={applyWidth ? height : ''}
          height={height}
          disabled={features?.isLocked}
          onClick={() => {
            clearSearch();
            if (lastModule === 'Albums') {
              navigate('/albums');
            } else if (lastModule === 'Tracks') {
              navigate('/tracks');
            } else {
              navigate('/albums');
            }
          }}
          content={(
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div style={{paddingTop: '2px'}}>{search}</div>
              <div><X style={{ fontSize: '25px', marginLeft: '3px' }} /></div>
            </div>
          )}
        />
        {!search && (
          <Button
            width={applyWidth ? height : ''}
            height={height}
            disabled={features?.isLocked}
            onClick={() => setSearch('')}
            content={<FormattedMessage id="search" />}
          />
        )}
      </>
    );
  }

  return searchButton;
};

export default JukeboxNavSearchButtons;
