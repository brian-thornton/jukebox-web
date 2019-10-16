import React, { useState } from 'react';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import styles from './styles';

function LibraryList() {
  const [libraries, setLibraries] = useState([]);

  const loadLibraries = () => {
    LibrianClient.getLibraries().then((libraries) => {
      setLibraries(libraries);
    });
  };

  const deleteLibrary = (name) => {
    LibrianClient.delete(name).then(() => {
      LibrianClient.getLibraries().then((libraries) => {
        setLibraries(libraries);
      });
    });
  };

  loadLibraries();

  const renderLibraries = [];
  libraries.forEach((library) => {
    const enabled = library.enabled ? 'Enabled' : 'Disabled';
    const style = library.enabled ? styles.enabledStyle : styles.disabledStyle;
    renderLibraries.push(
      (
        <ListGroupItem style={styles.cardStyle} key={library.path}>
          {library.path}
          <Button
            style={styles.buttonStyle}
            variant="outline-light"
            className="float-right"
          >
            Scan
          </Button>
          <Button
            style={styles.buttonStyle}
            variant="outline-light"
            className="float-right"
            onClick={() => {
              deleteLibrary(library.name);
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
