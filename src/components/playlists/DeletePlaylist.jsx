import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../layout/SettingsProvider';
import { applyLighting } from '../../lib/lightingHelper';

import './PlaylistDetail.scss';

const DeletePlaylist = () => {
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
      <Card.Title className="deleteCardTitle">Delete Playlist?</Card.Title>
      <Card.Body>
        <Card.Text>
          Are you sure that you want to delete the playlist?
        </Card.Text>
        <Button onClick={() => navigate(-1)}>No</Button>
        <Button className="deleteConfirmButton">Yes</Button>
      </Card.Body>
      </Card>
    </>
  );
};

export default DeletePlaylist;