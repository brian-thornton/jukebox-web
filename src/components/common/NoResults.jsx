import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Card } from 'react-bootstrap';

import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  controls: PropTypes.node,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

function NoResults({ text, title, controls }) {
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
        <Card.Title style={{ textAlign: 'center' }}>{title}</Card.Title>
        <Card.Text style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {text}
        </Card.Text>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
