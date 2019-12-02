import React, { useState } from 'react';
import {
  ListGroup, ListGroupItem, Button, Col, Row, Container, Modal, InputGroup, FormControl,
} from 'react-bootstrap';
import LibrianClient from '../lib/librarian-client';
import styles from './styles';

function LibraryList() {
  const [libraries, setLibraries] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = (path) => {
    if (path) {
      LibrianClient.add({
        path,
      });
    }
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const loadLibraries = () => {
    LibrianClient.getLibraries().then((data) => {
      setLibraries(data);
    });
  };

  const deleteLibrary = (name) => {
    LibrianClient.delete(name).then(() => {
      LibrianClient.getLibraries().then((data) => {
        setLibraries(data);
      });
    });
  };

  const onScan = (library) => {
    LibrianClient.scan(library);
  };

  loadLibraries();

  const renderLibraries = [];
  libraries.forEach((library) => {
    delete library.tracks;
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
            onClick={() => onScan({
              name: library.name,
              path: library.path,
              enabled: library.enabled,
            })}
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
    <>
      <Container>
        <Row>
          <Col lg={12} xl={12}>
            <ListGroup>
              {renderLibraries}
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col lg={12} xl={12}>
            <Button
              variant="outline-light"
              className="float-right"
              onClick={handleShow}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Library</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              id="path"
              placeholder="Path"
              aria-label="Path"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleClose(document.getElementById('path').value)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default LibraryList;
