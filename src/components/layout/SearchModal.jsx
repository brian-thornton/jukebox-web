import React, { useState, useContext} from 'react';
import {
  Button,
  Modal,
  Container,
  Row,
} from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { SettingsContext } from './Jukebox';

import './SearchModal.css';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
};

function SearchModal({
  isOpen,
  handleClose,
  search,
}) {
  const settings = useContext(SettingsContext);
  const [searchText, setSearchText] = useState('Enter Search');
  const { styles } = settings;

  const inputButton = (value, padding) => {
    const inputButtonStyle = {
      width: '55px',
      height: '55px',
      background: styles.buttonBackgroundColor,
      fontFamily: styles.buttonFont,
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

  const row = content => content.map(char => inputButton(char));

  return (
    <React.Fragment>
      <Modal dialogClassName="modal-90w" show={isOpen} onHide={() => handleClose('')}>
        <Modal.Header style={{ background: styles.headerColor, fontFamily: styles.headerFont }} closeButton className="header">
          <Modal.Title>{searchText}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: styles.popupBackgroundColor }} className="body">
          <Container>
            <Row>
              {inputButton(1, 60)}
              {row([2, 3, 4, 5, 6, 7, 8, 9, 0])}
            </Row>
            <Row>
              {inputButton('Q', 60)}
              {row(['W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'])}
            </Row>
            <Row>
              {inputButton('A', 100)}
              {row(['S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'])}
            </Row>
            <Row>
              {inputButton('Z', 150)}
              {row(['X', 'C', 'V', 'B', 'N', 'M', '.'])}
            </Row>
            <Row>
              <Button style={{ background: styles.buttonBackgroundColor, fontFamily: styles.buttonFont }} variant="outline-light" className="space-button" onClick={() => setSearchText(`${searchText} `)}>Space</Button>
              <Button style={{ background: styles.buttonBackgroundColor, fontFamily: styles.buttonFont }} variant="outline-light" className="clear-button" onClick={() => setSearchText('')}>Clear</Button>
              <Button style={{ background: styles.buttonBackgroundColor, fontFamily: styles.buttonFont }} variant="outline-light" className="search-button" onClick={() => handleClose(searchText)}>Search Now</Button>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

SearchModal.propTypes = propTypes;

export default SearchModal;
