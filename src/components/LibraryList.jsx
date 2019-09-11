import React from 'react';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import LibrianClient from '../lib/librarian-client';

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

export class LibraryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libraries: [],
    };
    LibrianClient.getLibraries().then((libraries) => {
      const that = this;

      that.setState({
        libraries,
      });
      that.forceUpdate();
    });
  }

  render() {
    const cardStyle = {
      background: 'transparent',
      color: 'white',
      borderColor: '#708090',
    };

    const buttonStyle = {
      margin: '5px',
    };

    const renderLibraries = [];
    const { libraries } = this.state;
    libraries.forEach((library) => {
      renderLibraries.push(
        (
          <ListGroupItem style={cardStyle} key={library.path}>
            {library.path}
            <Button
              style={buttonStyle}
              variant="outline-light"
              className="float-right"
            >
              Scan
            </Button>
            <Button
              style={buttonStyle}
              variant="outline-light"
              className="float-right"
            >
              Delete
            </Button>
          </ListGroupItem>
        ),
      );
    });

    return (
      <ListGroup>
        {renderLibraries}
      </ListGroup>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LibraryList);
