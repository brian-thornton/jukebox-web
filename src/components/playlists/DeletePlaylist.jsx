import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import { SettingsContext } from '../layout/SettingsProvider';
import { applyLighting } from '../../lib/lightingHelper';

import './PlaylistDetail.scss';

const DeletePlaylist = ({ intl }) => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();

  useEffect(() => applyLighting(settings, 'Delete'), []);

  const noResultsStyle = {
    borderColor: settings.styles.fontColor,
    color: settings.styles.fontColor,
  };

  return (
    <>
      <Card className="deletePlaylistCard" style={noResultsStyle}>
        <Card.Title className="deleteCardTitle">{intl.formatMessage({ id: 'delete_playlist_title' })}</Card.Title>
        <Card.Body>
          <Card.Text>
            {intl.formatMessage({ id: 'delete_playlist_text' })}
          </Card.Text>
          <Button onClick={() => navigate(-1)}>{intl.formatMessage({ id: 'no' })}</Button>
          <Button className="deleteConfirmButton">{intl.formatMessage({ id: 'yes' })}</Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default injectIntl(DeletePlaylist);
