import React from 'react';
import {
  Button,
  Container,
  Row,
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import Album from './Album';

export default class AlbumList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start: 0,
      limit: 100,
      albums: [],
    };
    this.loadAlbums();
    this.loadAlbums = this.loadAlbums.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  loadAlbums() {
    const { start, limit } = this.state;
    LibrianClient.getAlbums(start, limit).then((data) => {
      const that = this;
      const { albums } = this.state;
      that.setState({
        albums: albums.concat(data),
      });
      that.forceUpdate();
    });
  }

  loadMore() {
    const { limit } = this.state;
    this.setState({
      start: limit,
      limit: limit + 100,
    });
    this.loadAlbums();
  }

  render() {
    const { albums } = this.state;
    const renderAlbums = [];
    if (albums) {
      for (let i = 0; i < albums.length; i += 1) {
        renderAlbums.push(
          <Album album={albums[i]} />
        );
      }
    }

    return (
      <Container>
        <Row>
          {renderAlbums}
        </Row>
        <Row>
          <Button block variant="outline-info" onClick={this.loadMore}>Load More</Button>
        </Row>
      </Container>
    );
  }
}
