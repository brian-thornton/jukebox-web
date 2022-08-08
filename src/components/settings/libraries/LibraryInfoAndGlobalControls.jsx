import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Button from '../../Button';

import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './Libraries.module.css';

const LibraryInfoAndGlobalControls = ({ onScanAll, onDeleteAll, handleDiscover, handleShow, currentScan, totalTracks, isScanning }) => {
  const settings = useContext(SettingsContext);

  const scanAllButton = (
    <Button disabled={isScanning} onClick={onScanAll} content="Scan All" />
  );

  const deleteAllButton = (
    <Button disabled={isScanning} onClick={onDeleteAll} content="Delete All" />
  );

  const discoverButton = (
    <Button disabled={isScanning} onClick={handleDiscover} content="Discover" />
  );

  const addButton = <Button disabled={isScanning} onClick={handleShow} content="Add" />;

  return (
    <Container fluid>
      <Row>
        <Col>
          <div style={{ color: settings.styles.fontColor, marginTop: '20px' }}>
            {!currentScan && <div>{`Total Library Tracks: ${totalTracks}`}</div>}
            {currentScan && <div className={styles.scanText}>{`Currently Scanning: ${currentScan}`}</div>}
          </div>
        </Col>
        <Col>
          <div className={styles.libraryButton}>{addButton}</div>
          <div className={styles.libraryButton}>{discoverButton}</div>
          <div className={styles.libraryButton}>{deleteAllButton}</div>
          <div className={styles.libraryButton}>{scanAllButton}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default LibraryInfoAndGlobalControls;