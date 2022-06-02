import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { PropTypes } from 'prop-types';

import Button from '../Button';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function Search({
  handleClose, setIsSearchOpen, setSearchText, searchText = 'Enter Search',
}) {
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
            setIsSearchOpen(false);
          } else {
            setLocalSearch(`${localSearch}${key}`);
          }
        }}
      />

      <Container fluid style={{ marginTop: '60px' }}>
        <div style={{ color: 'white', fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{localSearch || searchText}</div>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {inputButton(1, 60)}
          {row([2, 3, 4, 5, 6, 7, 8, 9, 0])}
        </Row>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {inputButton('Q', 60)}
          {row(['W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'])}
        </Row>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {inputButton('A', 100)}
          {row(['S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'])}
        </Row>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {inputButton('Z', 150)}
          {row(['X', 'C', 'V', 'B', 'N', 'M', '.'])}
        </Row>
        <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button width="150" height="55" onClick={() => {
            setLocalSearch(`${localSearch} `);
          }} content="Space" />
          <Button width="150" height="55" onClick={() => {
            setSearchText('');
            setIsSearchOpen(false);
          }} content="Clear" />
          <Button width="150" height="55" onClick={() => {
            setSearchText(localSearch);
            setIsSearchOpen(false);
          }} content="Search Now" />
        </Row>
      </Container>
    </>
  );
}

Search.propTypes = propTypes;

export default Search;
