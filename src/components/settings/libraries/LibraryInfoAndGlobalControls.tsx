import { FC, useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../../Button';
import Confirm from '../../common/Confirm';

import { SettingsContext } from '../../layout/SettingsProvider';
import './Libraries.scss';

interface ILibraryInfoAndGlobalControls {
  setIsCategoryConfigOpen: Function,
  onScanAll: Function,
  onDeleteAll: Function,
  handleDiscover: Function,
  handleShow: Function,
  currentScan: string,
  totalTracks: number,
  isScanning: boolean,
};

const LibraryInfoAndGlobalControls: FC<ILibraryInfoAndGlobalControls> = ({
  setIsCategoryConfigOpen,
  onScanAll,
  onDeleteAll,
  handleDiscover,
  handleShow,
  currentScan,
  totalTracks,
  isScanning,
}) => {
  const intl = useIntl();
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);
  const settings = useContext(SettingsContext);

  const categories = (
    <Button disabled={isScanning} onClick={() => setIsCategoryConfigOpen(true)} content={<FormattedMessage id="categories" />} />
  );

  const scanAllButton = (
    <Button disabled={isScanning} onClick={onScanAll} content={<FormattedMessage id="scan_all" />} />
  );

  const deleteAllButton = (
    <Button disabled={isScanning} onClick={() => setIsDeleteAllConfirmOpen(true)} content={<FormattedMessage id="delete_all" />} />
  );

  const discoverButton = (
    <Button disabled={isScanning} onClick={handleDiscover} content={<FormattedMessage id="discover" />} />
  );

  const addButton = <Button disabled={isScanning} onClick={handleShow} content={<FormattedMessage id="add" />} />;

  return (
    <>
      {isDeleteAllConfirmOpen && (
        <Confirm
          text={intl.formatMessage({id: 'delete_libraries_text'})}
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
              <div style={{ color: settings?.styles?.fontColor, marginTop: '20px' }}>
                {!currentScan && <div><FormattedMessage id="library_total_tracks" values={{ totalTracks }} /></div>}
                {currentScan && <div className="scanText"><FormattedMessage id="currently_scanning" values={{ currentScan }} /></div>}
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

export default LibraryInfoAndGlobalControls;