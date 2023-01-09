import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { BackspaceFill } from 'react-bootstrap-icons';

import Button from '../Button';
import './Search.scss';
import { SettingsContext } from '../layout/SettingsProvider';
import { applyLighting } from '../../lib/lightingHelper';
import { topMargin } from '../../lib/styleHelper';

const propTypes = {
  setSearchText: PropTypes.func.isRequired,
};

const Search = ({
  setSearchText,
}) => {
  const [lightingApplied, setLightingApplied] = useState(false);
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const { isScreenSmall } = settings;
  const [localSearch, setLocalSearch] = useState('');
  
  const inputButton = value => (
    <Button
      className="searchButton"
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
      className="searchButton"
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

  const row = content => content.map(char => inputButton(char));

  const searchButton = (text, target) => (
    <Button
      className="keyboardRow searchButton"
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

      <Container style={{ marginTop: topMargin(settings) }}>
        <Row>
          <FormControl
            className="searchForm"
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
            <Row className="keyboardRow firstKeyboardRow">
              {inputButton(1, 60)}
              {row([2, 3, 4, 5, 6, 7, 8, 9, '0'])}
              {backspace(<BackspaceFill />)}
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
              <Button
                hideOnSmall
                className="searchButton"
                width="500"
                height="55"
                onClick={() => setLocalSearch(`${localSearch} `)}
                content="Space"
              />
              <Button
                hideOnSmall
                className="searchButton"
                width="150"
                height="55"
                onClick={() => {
                  setSearchText('');
                }}
                content="Clear"
              />
            </Row>
          </Container>
        </Row>
        <Row className="keyboardRow">
          {searchButton('Search Albums', '/albums')}
          {searchButton('Search Tracks', '/tracks')}
        </Row>
      </Container>
    </>
  );
};

Search.propTypes = propTypes;

export default Search;
