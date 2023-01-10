import { PropTypes } from 'prop-types';
import React, { useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { injectIntl } from 'react-intl';

import Button from '../../Button';
import Confirm from '../../common/Confirm';

import { SettingsContext } from '../../layout/SettingsProvider';
import './Libraries.scss';

const propTypes = {
  setIsCategoryConfigOpen: PropTypes.func.isRequired,
  onScanAll: PropTypes.func.isRequired,
  onDeleteAll: PropTypes.func.isRequired,
  handleDiscover: PropTypes.func.isRequired,
  handleShow: PropTypes.func.isRequired,
  currentScan: PropTypes.string,
  totalTracks: PropTypes.number,
  isScanning: PropTypes.bool,
};

const LibraryInfoAndGlobalControls = ({
  intl,
  setIsCategoryConfigOpen,
  onScanAll,
  onDeleteAll,
  handleDiscover,
  handleShow,
  currentScan,
  totalTracks,
  isScanning,
}) => {
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);
  const settings = useContext(SettingsContext);

  const categories = (
    <Button disabled={isScanning} onClick={() => setIsCategoryConfigOpen(true)} content={intl.formatMessage({ id: 'categories' })} />
  );

  const scanAllButton = (
    <Button disabled={isScanning} onClick={onScanAll} content={intl.formatMessage({ id: 'scan_all' })} />
  );

  const deleteAllButton = (
    <Button disabled={isScanning} onClick={() => setIsDeleteAllConfirmOpen(true)} content={intl.formatMessage({ id: 'delete_all' })} />
  );

  const discoverButton = (
    <Button disabled={isScanning} onClick={handleDiscover} content={intl.formatMessage({ id: 'discover' })} />
  );

  const addButton = <Button disabled={isScanning} onClick={handleShow} content={intl.formatMessage({ id: 'add' })} />;

  return (
    <>
      {isDeleteAllConfirmOpen && (
        <Confirm
          text={intl.formatMessage({ id: 'delete_libraries_text' })}
          onCancel={() => setIsDeleteAllConfirmOpen(false)}
          onConfirm={() => {
            onDeleteAll();
            setIsCategoryConfigOpen(false);
          }}
        />
      )}
      {!isDeleteAllConfirmOpen && (
        <Container fluid>
          <Row>
            <Col lg="4" md="4">
              <div style={{ color: settings.styles.fontColor, marginTop: '20px' }}>
                {!currentScan && <div>{`${intl.formatMessage({ id: 'total_library_tracks' })}: ${totalTracks}`}</div>}
                {currentScan && <div className="scanText">{`C${intl.formatMessage({ id: 'currently_scanning' })}: ${currentScan}`}</div>}
              </div>
            </Col>
            <Col lg="8" md="8">
              <div className="libraryButton">{addButton}</div>
              <div className="libraryButton">{discoverButton}</div>
              <div className="libraryButton">{deleteAllButton}</div>
              <div className="libraryButton">{scanAllButton}</div>
              <div className="libraryButton">{categories}</div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

LibraryInfoAndGlobalControls.defaultProps = {
  currentScan: '',
  totalTracks: 0,
  isScanning: false,
};

LibraryInfoAndGlobalControls.propTypes = propTypes;

export default injectIntl(LibraryInfoAndGlobalControls);
