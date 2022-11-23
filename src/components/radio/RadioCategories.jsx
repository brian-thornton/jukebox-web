import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';

import { SettingsContext } from '../layout/SettingsProvider';
import Button from '../Button';
import ExpandRow from '../common/ExpandRow';

const RadioCategories = ({ category, setCategory }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;
  const { controlButtonSize } = settings.styles;
  const isScreenSmall = window.innerWidth < 700;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 50;

  const categories = [
    'Rock', 'Pop', 'Charts', 'Hits', '70s', '80s', '90s', 'Oldies', 'Country', 'Rap', 'Dance'
  ];

  const buttons = (
    <>
      {categories.map((c) => (
        <Button
          disabled={features.isLocked}
          onClick={() => setCategory(c)}
          isSelected={c === category}
          width="100%"
          height={buttonHeight}
          content={c}
        />
      ))}
    </>
  );

  if (isScreenSmall) {
    return <ExpandRow text="Categories" buttons={buttons} />;
  }

  return (
    <Container fluid style={{ paddingRight: '0px', marginRight: '0px' }}>
      <Row>
        {buttons}
      </Row>
    </Container>
  );
};

export default RadioCategories;
