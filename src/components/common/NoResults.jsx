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

const NoResults = ({ text, title, controls, marginTop }) => {
  const settings = useContext(SettingsContext);

  const noResultsStyle = {
    color: settings.styles.fontColor,
    marginTop: marginTop ? marginTop : '0',
  };

  return (
    <Card className="no-results-card" style={noResultsStyle}>
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
