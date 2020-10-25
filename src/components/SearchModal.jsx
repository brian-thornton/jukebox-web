import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Container,
  Row,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import './SearchModal.css';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function SearchModal({ isOpen, handleClose }) {
  const [searchText, setSearchText] = useState('Enter Search');

  const keydownListener = (event) => {
    const whitelistKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
      'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.'];

    if (whitelistKeys.includes(event.key.toLowerCase())) {
      if (searchText === 'Enter Search') {
        setSearchText(event.key);
      } else {
        setSearchText(`${searchText}${event.key}`);
      }
    } else if (event.key.toLowerCase() === ' ') {
      if (searchText === 'Enter Search') {
        setSearchText(' ');
      } else {
        setSearchText(`${searchText} `);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keydownListener, true);
    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener]);

  const inputButton = (value, padding) => {
    const inputButtonStyle = {
      width: '75px',
      height: '75px',
    };

    if (padding) {
      inputButtonStyle.marginTop = '5px';
      inputButtonStyle.marginBottom = '5px';
      inputButtonStyle.marginRight = '5px';
      inputButtonStyle.marginLeft = `${padding}px`;
    } else {
      inputButtonStyle.margin = '5px';
    }

    return (
      <Button
        key={value}
        style={inputButtonStyle}
        variant="outline-light"
        onClick={() => {
          if (searchText === 'Enter Search') {
            setSearchText(value);
          } else {
            setSearchText(`${searchText}${value}`);
          }
        }}
      >
        {value}
      </Button>
    );
  };

  return (
    <Modal dialogClassName="modal-90w" show={isOpen} onHide={() => handleClose('')}>
      <Modal.Header closeButton className="header">
        <Modal.Title>{searchText}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="body">
        <Container>
          <Row>
            {inputButton(1, 60)}
            {inputButton(2)}
            {inputButton(3)}
            {inputButton(4)}
            {inputButton(5)}
            {inputButton(6)}
            {inputButton(7)}
            {inputButton(8)}
            {inputButton(9)}
            {inputButton(0)}
          </Row>
          <Row>
            {inputButton('Q', 60)}
            {inputButton('W')}
            {inputButton('E')}
            {inputButton('R')}
            {inputButton('T')}
            {inputButton('Y')}
            {inputButton('U')}
            {inputButton('I')}
            {inputButton('O')}
            {inputButton('P')}
          </Row>
          <Row>
            {inputButton('A', 100)}
            {inputButton('S')}
            {inputButton('D')}
            {inputButton('F')}
            {inputButton('G')}
            {inputButton('H')}
            {inputButton('J')}
            {inputButton('K')}
            {inputButton('L')}
          </Row>
          <Row>
            {inputButton('Z', 150)}
            {inputButton('X')}
            {inputButton('C')}
            {inputButton('V')}
            {inputButton('B')}
            {inputButton('N')}
            {inputButton('M')}
            {inputButton('.')}
          </Row>
          <Row>
            <Button variant="outline-light" className="space-button" onClick={() => setSearchText(`${searchText} `)}>Space</Button>
            <Button variant="outline-light" className="clear-button" onClick={() => setSearchText('')}>Clear</Button>
            <Button variant="outline-light" className="search-button" onClick={() => handleClose(searchText)}>Search Now</Button>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

SearchModal.propTypes = propTypes;

export default SearchModal;
