import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';

import { SettingsContext } from '../layout/SettingsProvider';
import Button from '../Button';

const propTypes = {
  startsWithFilter: PropTypes.string.isRequired,
  setStartsWithFilter: PropTypes.func.isRequired,
};

const StartsWithFilter = ({ startsWithFilter, setStartsWithFilter }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;
  const { startsWithLocation } = settings.preferences;
  const availableHeight = window.innerHeight;
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const buttonStyle = {
    marginTop: availableHeight < 700 ? '0px' : '5px',
    marginBottom: availableHeight < 700 ? '0px' : '5px',
  };

  const filterStyle = {
    paddingRight: startsWithLocation === 'left' ? '0px' : '0px',
    marginRight: startsWithLocation === 'left' ? '0px' : '0px',
  };

  return (
    <Container fluid style={filterStyle}>
      <Row>
        {alphabet.map(letter => (
          <Button
            disabled={features.isLocked}
            onClick={() => setStartsWithFilter(letter)}
            isSelected={letter === startsWithFilter}
            width="40%"
            height="30"
            style={buttonStyle}
            content={letter}
          />
        ))}
        <Button
          disabled={features.isLocked}
          onClick={() => setStartsWithFilter(null)}
          width="86%"
          height="45"
          content="All"
        />
      </Row>
    </Container>
  );
};

StartsWithFilter.propTypes = propTypes;

export default StartsWithFilter;
