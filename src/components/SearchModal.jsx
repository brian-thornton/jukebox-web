import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Container,
  Row,
  Form,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import './SearchModal.css';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function SearchModal({ isOpen, handleClose, search }) {
  const [searchText, setSearchText] = useState(search || 'Enter Search');

  const inputButton = (value, padding) => {
    const inputButtonStyle = {
      width: '55px',
      height: '55px',
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
    <React.Fragment>
      <Modal dialogClassName="modal-90w" show={isOpen} onHide={() => {
        handleClose('');
      }}>
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
              <Button variant="outline-light" className="search-button" onClick={() => {
                handleClose(searchText);
              }
              }>Search Now</Button>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

SearchModal.propTypes = propTypes;

export default SearchModal;
