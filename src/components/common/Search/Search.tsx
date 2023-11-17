import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
//import KeyboardEventHandler from 'react-keyboard-event-handler';
import { FC, useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
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
    <>
      {/* <KeyboardEventHandler
        handleKeys={['alphanumeric', 'space', 'backspace', 'cmd+v', '-', '.', 'enter']}
        onKeyEvent={(key) => {
          if (key === 'space') {
            setLocalSearch(`${localSearch} `);
          } else if (key === 'backspace') {
            setLocalSearch(`${localSearch.substring(0, localSearch.length - 1)}`);
          } else if (key === 'enter') {
            setSearchText(localSearch);
            navigate('/albums');
          } else {
            setLocalSearch(`${localSearch}${key}`);
          }
        }}
      /> */}

      <Container>
        <Row>
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
        </Row>
        <Row>
          <Container fluid className="d-none d-sm-block">
            <Row className={`${styles.keyboardRow} ${styles.firstKeyboardRow}`}>
              {inputButton(1)}
              {row([2, 3, 4, 5, 6, 7, 8, 9, '0'])}
              {backspace()}
            </Row>
            <Row className={styles.keyboardRow}>
              {inputButton('Q')}
              {row(['W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'])}
            </Row>
            <Row className={styles.keyboardRow}>
              {inputButton('A')}
              {row(['S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'])}
            </Row>
            <Row className={styles.keyboardRow}>
              {inputButton('Z')}
              {row(['X', 'C', 'V', 'B', 'N', 'M', '.'])}
            </Row>
            <Row className={styles.keyboardRow}>
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
            </Row>
          </Container>
        </Row>
        <Row className={styles.keyboardRow}>
          {searchButton(<FormattedMessage id="search_albums" />, '/albums')}
          {searchButton(<FormattedMessage id="search_tracks" />, '/tracks')}
        </Row>
      </Container>
    </>
  );
};

export default Search;
