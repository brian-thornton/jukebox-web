import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';

import { SettingsContext } from '../layout/SettingsProvider';
import Button from '../Button';

const RadioCategories = ({ category, setCategory }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;
  const categories = [
    'Rock', 'Classic Rock', 'Pop', 'Charts', 'Hits', '70s', '80s', '90s', 'Oldies', 'Country', 'Alternative', 'Rap', 'Dance'
  ];

  return (
    <Container fluid style={{ paddingRight: '0px', marginRight: '0px' }}>
      <Row>
        {categories.map((c) => (
          <Button
            disabled={features.isLocked}
            onClick={() => setCategory(c)}
            isSelected={c === category}
            width="100%"
            height="30"
            content={c}
          />
        ))}
      </Row>
    </Container>
  );
};

export default RadioCategories;
