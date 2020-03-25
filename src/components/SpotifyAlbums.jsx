import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Row,
} from 'react-bootstrap';
import Album from './Album';
import SpotifyClient from '../lib/spotify-client';

function SpotifyAlbums(props) {
  const limit = 20;
  const [start, setStart] = useState(0);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    loadAlbums(0, limit);
  }, [props.search]);

  const loadAlbums = (start, limit) => {
    if (start >= 0 && limit) {
      SpotifyClient.getAccessToken().then((token) => {
        if (!window.accessToken) {
          window.accessToken = token.access_token;
        }

        let searchBox = document.getElementById('searchBox').value;
        let query = searchBox ? searchBox : 'Greatest Hits';

        SpotifyClient.findAlbums(query, limit, start).then((data) => {
          if (data.albums) {
            start === 0 ? setAlbums(data.albums.items) : setAlbums(albums.concat(data.albums.items));
            setStart(start + limit);
          }
        });
      });
    }
  };

  if (!albums.length) {
    loadAlbums(start, limit);
  }

  const renderAlbums = () => {
    const items = [];
    if (albums) {
      for (let i = 0; i < albums.length; i += 1) {
        items.push(
          <Album key={albums[i].images[1].url} album={albums[i]} coverArt={`${albums[i].images[1].url}?${Date.now}`} />,
        );
      }
    }
    return items;
  };

  return (
    <Container>
      <Row>
        {renderAlbums()}
      </Row>
      <Row>
        <Button block variant="outline-info" onClick={() => { loadAlbums(start, limit); }}>Load More</Button>
      </Row>
    </Container>
  );
}
export default SpotifyAlbums;
