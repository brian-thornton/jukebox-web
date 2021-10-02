import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import Button from '../Button';
import Modal from '../common/Modal';
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
  const [searchText, setSearchText] = useState('Enter Search');

  const inputButton = (value) => {
    return (
      <Button
        width="55"
        height="55"
        onClick={() => {
          if (searchText === 'Enter Search') {
            setSearchText(value);
          } else {
            setSearchText(`${searchText}${value}`);
          }
        }}
        content={value}
      />
    );
  };

  const row = content => content.map(char => inputButton(char));

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      isFooterHidden={true}
      onCancel={() => handleClose('')}
      title={searchText}
      body={(
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
            <Button width="150" height="55" onClick={() => setSearchText(`${searchText} `)} content="Space" />
            <Button width="150" height="55" onClick={() => setSearchText('')} content="Clear" />
            <Button width="150" height="55" onClick={() => handleClose(searchText)} content="Search Now" />
          </Row>
        </Container>
      )}
    />
  );
}

SearchModal.propTypes = propTypes;

export default SearchModal;
