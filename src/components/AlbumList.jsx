import React from 'react';
import LibrianClient from '../lib/librarian-client';
import Album from './Album';

export default class AlbumList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    LibrianClient.getAlbums().then((albums) => {
      const that = this;
      that.setState({
        albums,
      });
      that.forceUpdate();
    });

    this.pageSize = 100;
    this.currentPage = 1;
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

    return renderAlbums;
  }
}
