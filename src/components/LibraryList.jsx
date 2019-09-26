import React, { useState } from 'react';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';

function LibraryList() {
  const [libraries, setLibraries] = useState([]);

  const loadLibraries = () => {
    LibrianClient.getLibraries().then((libraries) => {
      setLibraries(libraries);
    });
  }

  const deleteLibrary = (name) => {
    LibrianClient.delete(name).then(() => {
      LibrianClient.getLibraries().then((libraries) => {
        setLibraries(libraries);
      });
    })
  };

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

  loadLibraries();

  const renderLibraries = [];
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
              deleteLibrary(library.name)
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
export default LibraryList;
