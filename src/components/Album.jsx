import React from 'react';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import LibrianClient from '../lib/librarian-client';
import defaultCover from '../default_album.jpg';

const actions = require('../actions/index');

const mapStateToProps = function (state) {
  return {
    currentAlbum: state.currentAlbum,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    setCurrentAlbum: album => (
      dispatch(actions.setCurrentAlbum(album))
    ),
    setMode: (mode) => {
      dispatch(actions.setMode(mode));
    },
  };
};

class Album extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    LibrianClient.getCoverArt(props.album.path).then((image) => {
      const that = this;
      let src;

      if (image.type === 'image/jpeg') {
        src = URL.createObjectURL(image);
      } else {
        src = defaultCover;
      }

      that.setState({
        coverArt: src,
      });
      that.forceUpdate();
    });

    this.pageSize = 100;
    this.currentPage = 1;
  }

  largeAlbum() {
    const cardStyle = {
      background: 'transparent',
      color: 'white',
      borderColor: '#708090',
      margin: '10px',
      maxWidth: '200px',
    };

    const { album, setCurrentAlbum } = this.props;
    const { coverArt } = this.state;

    return (
      <Card style={cardStyle} className="h-55 w-85" onClick={() => setCurrentAlbum(album)}>
        <Card.Img style={{ maxHeight: '300px', maxWidth: '250px' }} top src={coverArt} />
        <Card.Body>
          <Card.Title style={{ maxHeight: '25px', fontSize: '12px', overflow: 'hidden' }}>{album.name}</Card.Title>
        </Card.Body>
      </Card>
    );
  }

  render() {
    return this.largeAlbum();
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Album);
