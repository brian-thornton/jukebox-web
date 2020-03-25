import React, { useState } from 'react';
import {
  Container,
  Row,
  Card,
} from 'react-bootstrap';
import SpotifyClient from '../lib/spotify-client';
import styles from './styles';

function Categories() {
  const [categories, setCategories] = useState();

  const loadCategories = () => {
    SpotifyClient.getAccessToken().then((token) => {
      if (!window.accessToken) {
        window.accessToken = token.access_token;
      }

      SpotifyClient.categories().then((data) => {
        setCategories(data);
        console.log(data);
      });
    });
  };

  if (!categories) {
    loadCategories();
  }

  const renderCategories = () => {
    const items = [];
    if (categories.categories.items) {
      for (let i = 0; i < categories.categories.items.length; i += 1) {
        items.push(
          <Card style={styles.albumCardStyle} className="h-55 w-85">
            <Card.Img style={styles.albumImage} top src={categories.categories.items[i].icons[0].url} />
            <Card.Body>
              <Card.Title style={styles.albumTitle}>{categories.categories.items[i].name}</Card.Title>
            </Card.Body>
          </Card>,
        );
      }
    }
    return items;
  };

  if (categories) {
    return (
      <Container>
        <Row>
          {renderCategories()}
        </Row>
      </Container>
    );
  }
  return (
    <Container>
      <Row>
      </Row>
    </Container>
  );
}
export default Categories;
