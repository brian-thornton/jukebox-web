import Card from 'react-bootstrap/Card';
import { PropTypes } from 'prop-types';
import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FormattedMessage } from 'react-intl';

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
  text, title, controls, applyMargin, goBackText, onGoBack,
}) => {
  const settings = useContext(SettingsContext);

  const noResultsStyle = {
    color: settings.styles.fontColor,
    marginTop: applyMargin ? topMargin(settings) : '',
    width: "100%",
  };

  return (
    <Container fluid className="no-results-container">
      {onGoBack && (
        <Row>
          <Button onClick={onGoBack} content={<FormattedMessage id="go_back" />} />
        </Row>
      )}
      <Row className="no-results-row">
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
