import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { injectIntl } from 'react-intl';

import { SettingsContext } from '../layout/SettingsProvider';
import Button from '../Button';
import ExpandRow from '../common/ExpandRow';
import './RadioCategories.scss';

const propTypes = {
  category: PropTypes.string,
  setCategory: PropTypes.func.isRequired,
};

const RadioCategories = ({ category, intl, setCategory }) => {
  const settings = useContext(SettingsContext);
  const { features, isScreenSmall } = settings;
  const [isExpanded, setIsExpanded] = useState(false);
  const { controlButtonSize } = settings.styles;
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 50;
  const fontSize = ['large', 'medium'].includes(controlButtonSize) ? '30px' : '';

  const categories = [
    'Rock', 'Pop', '70s', '80s', '90s', 'Oldies', 'Country', 'Rap', 'Dance',
  ];

  const buttons = (
    <>
      {categories.map(c => (
        <Button
          style={{ fontSize }}
          disabled={features.isLocked}
          onClick={() => {
            setCategory(c);
            setIsExpanded(false);
          }}
          isSelected={c === category}
          width="100%"
          height={buttonHeight}
          content={c}
        />
      ))}
    </>
  );

  if (isScreenSmall) {
    return (
      <ExpandRow
        buttons={buttons}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        text={intl.formatMessage({id: 'categories'})}
      />
    );
  }

  return (
    <Container fluid className="categoriesContainer">
      <Row>
        {buttons}
      </Row>
    </Container>
  );
};

RadioCategories.defaultProps = {
  category: '',
};

RadioCategories.propTypes = propTypes;

export default injectIntl(RadioCategories);
