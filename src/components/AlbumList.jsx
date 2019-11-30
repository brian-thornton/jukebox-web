import React from 'react';
import { PropTypes } from 'prop-types';
import {
  Button,
  Container,
  Row,
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import Album from './Album';

export class AlbumList extends React.Component {
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

  componentDidUpdate(prevProps) {
    const { search } = this.props;
    if (search !== prevProps.search) {
      this.loadAlbums();
    }
  }

  loadAlbums() {
    const { start, limit } = this.state;
    const { search } = this.props;

    if (search) {
      this.setState({ albums: [] });
      LibrianClient.searchAlbums(search).then((data) => {
        const that = this;

        that.setState({
          albums: data,
        });
        that.forceUpdate();
      });
    } else {
      LibrianClient.getAlbums(start, limit).then((data) => {
        const that = this;
        const { albums } = this.state;
        that.setState({
          albums: albums.concat(data),
          start: limit,
          limit: limit + 100
        });
        that.forceUpdate();
      });
    }
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
          <Album key={i} album={albums[i]} />,
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
export default AlbumList;

AlbumList.propTypes = {
  search: PropTypes.string,
};
AlbumList.defaultProps = {
  search: '',
};
