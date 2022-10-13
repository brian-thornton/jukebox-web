import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';
import './Search.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import { applyLighting } from '../../lib/lightingHelper';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const Search = ({
  setIsSearchOpen, setSearchText, searchText = 'Enter Search',
}) => {
  const [lightingApplied, setLightingApplied] = useState(false);
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const isScreenSmall = window.innerWidth < 700;
  const [localSearch, setLocalSearch] = useState('');
  const inputButton = value => (
    <Button
      width={isScreenSmall ? "50" : "55"}
      height={isScreenSmall ? "50" : "55"}
      onClick={() => {
        setLocalSearch(`${localSearch}${value}`);
      }}
      content={value}
    />
  );

  const fireLightingEvents = () => {
    applyLighting(settings, 'Albums');
    setLightingApplied(true);
  };

  if (!lightingApplied) {
    fireLightingEvents();
  };

  const row = content => content.map(char => inputButton(char));

  return (
    <>
      <KeyboardEventHandler
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
      />

      <Container className="searchContainer">
        <Row>
          <FormControl
            id="name"
            placeholder={localSearch || ''}
            aria-label="Name"
            defaultValue={localSearch}
            aria-describedby="basic-addon1"
            onChange={(event) => setLocalSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setSearchText(localSearch);
                navigate('/albums');
              }
            }}
          />
        </Row>
        <Row styles={{ marginTop: '0px', paddingTop: '0px' }}>
          <Container fluid className={`d-none d-sm-block`} styles={{ marginTop: '0px' }}>
            <Row className="keyboardRow">
              {inputButton(1, 60)}
              {row([2, 3, 4, 5, 6, 7, 8, 9, 0])}
            </Row>
            <Row className="keyboardRow">
              {inputButton('Q', 60)}
              {row(['W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'])}
            </Row>
            <Row className="keyboardRow">
              {inputButton('A', 100)}
              {row(['S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'])}
            </Row>
            <Row className="keyboardRow">
              {inputButton('Z', 150)}
              {row(['X', 'C', 'V', 'B', 'N', 'M', '.'])}
            </Row>
            <Row className="keyboardRow">
              <Button hideOnSmall width="150" height="55" onClick={() => {
                setLocalSearch(`${localSearch} `);
              }} content="Space" />
              <Button hideOnSmall width="150" height="55" onClick={() => {
                setSearchText('');
              }} content="Clear" />
            </Row>
          </Container>
        </Row>
        <Row className="keyboardRow">
          <Button className="keyboardRow" width="150" height="55" onClick={() => {
            setSearchText(localSearch);
            navigate('/albums');
          }} content="Search Albums" />
          <Button className="keyboardRow" width="150" height="55" onClick={() => {
            setSearchText(localSearch);
            navigate('/tracks');
          }} content="Search Tracks" />
        </Row>
      </Container>
    </>
  );
}

Search.propTypes = propTypes;

export default Search;
