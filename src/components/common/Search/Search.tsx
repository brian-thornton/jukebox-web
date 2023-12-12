import FormControl from 'react-bootstrap/FormControl';
import { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackspaceFill } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';

import Button from '../../Button';
import styles from './Search.module.css';
import { SettingsContext } from '../../layout/SettingsProvider';
import { applyLighting } from '../../../lib/helper/lightingHelper';

interface ISearch {
  setSearchText: Function,
}

const Search: FC<ISearch> = ({ setSearchText }) => {
  const [lightingApplied, setLightingApplied] = useState(false);
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const { isScreenSmall } = settings;
  const [localSearch, setLocalSearch] = useState('');

  const inputButton = (value: any) => (
    <Button
      width={isScreenSmall ? '50' : '75'}
      height={isScreenSmall ? '50' : '75'}
      onClick={() => {
        setLocalSearch(`${localSearch}${value}`);
      }}
      content={value}
    />
  );

  const backspace = () => (
    <Button
      width={isScreenSmall ? '50' : '75'}
      height={isScreenSmall ? '50' : '75'}
      onClick={() => {
        setLocalSearch(`${localSearch.slice(0, -1)}`);
      }}
      content={<BackspaceFill />}
    />
  );

  const fireLightingEvents = () => {
    applyLighting(settings, 'Albums');
    setLightingApplied(true);
  };

  if (!lightingApplied) {
    fireLightingEvents();
  }

  const row = (content: any) => content.map((char: any) => inputButton(char));

  const searchButton = (text: any, target: any) => (
    <Button
      width="300"
      height="55"
      onClick={() => {
        setSearchText(localSearch);
        navigate(target);
      }}
      content={text}
    />
  );

  return (
      <div className={styles.searchContainer}>
        <div className={styles.searchRow}>
          <FormControl
            className={styles.searchForm}
            id="name"
            placeholder={localSearch || ''}
            aria-label="Name"
            defaultValue={localSearch}
            aria-describedby="basic-addon1"
            onChange={event => setLocalSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setSearchText(localSearch);
                navigate('/albums');
              }
            }}
          />
        </div>
        <div className={styles.searchRow}>
          {row([1, 2, 3, 4, 5, 6, 7, 8, 9, '0'])}
          {backspace()}
        </div>
        <div className={styles.searchRow}>
          {row(['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'])}
        </div>
        <div className={styles.searchRow}>
          {row(['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'])}
        </div>
        <div className={styles.searchRow}>
          {row(['Z', 'X', 'C', 'V', 'B', 'N', 'M', '.'])}
        </div>
        <div className={styles.searchRow}>
          {row(['Z', 'X', 'C', 'V', 'B', 'N', 'M', '.'])}
        </div>
        <div className={styles.searchRow}>
          <Button
            hideOnSmall
            width="500"
            height="55"
            onClick={() => setLocalSearch(`${localSearch} `)}
            content={<FormattedMessage id="space" />}
          />
          <Button
            hideOnSmall
            width="150"
            height="55"
            onClick={() => {
              setSearchText('');
            }}
            content={<FormattedMessage id="clear" />}
          />
        </div>
        <div className={styles.searchRow}>
          {searchButton(<FormattedMessage id="search_albums" />, '/albums')}
          {searchButton(<FormattedMessage id="search_tracks" />, '/tracks')}
        </div>
      </div>
  );
};

export default Search;
