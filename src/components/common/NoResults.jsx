import Card from 'react-bootstrap/Card';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { SettingsContext } from '../layout/SettingsProvider';
import './NoResults.scss';
import { topMargin } from '../../lib/styleHelper';
import Button from '../Button';

const propTypes = {
  controls: PropTypes.node,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  applyMargin: PropTypes.bool,
};

const NoResults = ({
  text,
  title,
  controls,
  applyMargin,
  goBackText,
  onGoBack,
}) => {
  const settings = useContext(SettingsContext);

  const noResultsStyle = {
    color: settings.styles.fontColor,
    marginTop: applyMargin ? topMargin(settings) : '',
    width: "100%",
  };

  return (
    <Container fluid style={{width: "100%"}}>
      {onGoBack && (
        <Row>
          <Button onClick={onGoBack} content="Go Back" />
        </Row>
      )}
      <Row style={{width: "100%"}}>
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
      </Row>
    </Container >
  );
};

NoResults.defaultProps = {
  controls: null,
  applyMargin: true,
};

NoResults.propTypes = propTypes;

export default NoResults;
