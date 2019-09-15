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

  delete(name) {
    LibrianClient.delete(name).then(() => {
      LibrianClient.getLibraries().then((libraries) => {
        const that = this;

        that.setState({
          libraries,
        });
        that.forceUpdate();
      });
    })
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

    const enabledStyle = {
      background: '#7CFC00',
      color: '#000000',
      margin: '5px',
      width: '100px',
    }

    const disabledStyle = {
      background: '#FF0000',
      margin: '5px',
      width: '100px',
    }

    const renderLibraries = [];
    const { libraries } = this.state;
    libraries.forEach((library) => {
      const enabled = library.enabled ? 'Enabled' : 'Disabled';
      const style = library.enabled ? enabledStyle : disabledStyle;
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
              onClick={() => {
                this.delete(library.name)
              }}
            >
              Delete
            </Button>
            <Button
              style={style}
              variant="outline-light"
              className="float-right"
            >
              {enabled}
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
