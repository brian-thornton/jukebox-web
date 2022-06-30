import Card from 'react-bootstrap/Card';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';

import { SettingsContext } from '../layout/SettingsProvider';
import './NoResults.scss';

const propTypes = {
  controls: PropTypes.node,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const NoResults = ({ text, title, controls }) => {
  const settings = useContext(SettingsContext);

  const noResultsStyle = {
    background: 'transparent',
    minHeight: '200px',
    height: '100%',
    borderColor: 'black',
    color: settings.styles.fontColor,
    swidth: '18rem',
  };

  return (
    <Card style={noResultsStyle}>
      <Card.Body>
        <Card.Title className="no-results-title">{title}</Card.Title>
        <Card.Text className="no-results-text">
          {text}
        </Card.Text>
        <div className="no-results-text">
          {controls}
        </div>
      </Card.Body>
    </Card>
  );
}

NoResults.defaultProps = {
  controls: null,
};

NoResults.propTypes = propTypes;

export default NoResults;
