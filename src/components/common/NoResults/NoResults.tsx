import Card from 'react-bootstrap/Card';
import { FC, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FormattedMessage } from 'react-intl';

import { SettingsContext } from '../../layout/SettingsProvider';
import './NoResults.scss';
import { topMargin } from '../../../lib/styleHelper';
import Button from '../../Button';

interface INoResults {
  text?: string,
  title?: string,
  controls?: any,
  applyMargin?: boolean,
  onGoBack?: Function,
}

const NoResults: FC<INoResults> = ({
  text, title, controls, applyMargin = true, onGoBack,
}) => {
  const settings = useContext(SettingsContext);

  const noResultsStyle = {
    color: settings?.styles?.fontColor,
    marginTop: applyMargin ? topMargin(settings) : '',
    width: '100%',
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
    </Container>
  );
};

export default NoResults;
