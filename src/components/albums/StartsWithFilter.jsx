import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';

import Button from '../Button';

const StartsWithFilter = ({ startsWithFilter, setStartsWithFilter }) => {
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  return (
    <Container fluid style={{paddingRight: '0px', marginRight: '0px'}}>
      <Row>
        {alphabet.map((letter) => (
          <Button
            onClick={() => setStartsWithFilter(letter)}
            isSelected={letter === startsWithFilter}
            width="40%"
            height="30"
            content={letter}
          />
        ))}
        <Button
          onClick={() => setStartsWithFilter(null)}
          width="86%"
          height="45"
          content="All"
        />
      </Row>
    </Container>
  );
};

export default StartsWithFilter;
