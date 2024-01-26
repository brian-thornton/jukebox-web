import { FC, useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { MenuAppFill } from 'react-bootstrap-icons';

import Button from '../../../common/Buttons/Button/Button';
import Confirm from '../../../common/Confirm/Confirm';
import styles from './LibraryInfoAndGlobalControls.module.css';

import { SettingsContext } from '../../../layout/SettingsProvider';

interface ILibraryInfoAndGlobalControls {
  setIsCategoryConfigOpen: Function,
  onScanAll: Function,
  onDeleteAll: Function,
  handleDiscover: Function,
  handleShow: Function,
  currentScan: string,
  totalTracks: number,
  isScanning: boolean,
  showOnline: boolean,
  setShowOnline: Function,
  setIsMenuOpen: Function,
}

const LibraryInfoAndGlobalControls: FC<ILibraryInfoAndGlobalControls> = ({
  setIsCategoryConfigOpen,
  onScanAll,
  onDeleteAll,
  handleDiscover,
  handleShow,
  currentScan,
  totalTracks,
  isScanning,
  showOnline,
  setShowOnline,
  setIsMenuOpen,
}) => {
  const intl = useIntl();
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);
  const settings = useContext(SettingsContext);
  const { screen } = settings;

  const categories = (
    <Button disabled={isScanning} onClick={() => setIsCategoryConfigOpen(true)} content={<FormattedMessage id="categories" />} />
  );

  const showOnlineButton = (
    <Button
      disabled={isScanning}
      onClick={() => setShowOnline(!showOnline)}
      content={<FormattedMessage id={showOnline ? "show_all" : "show_online"} />}
    />
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
          text={intl.formatMessage({ id: 'delete_libraries_text' })}
          onCancel={() => setIsDeleteAllConfirmOpen(false)}
          onConfirm={() => {
            onDeleteAll();
            setIsCategoryConfigOpen(false);
          }}
        />
      )}
      {screen?.isMobile && (
        <Button
          onClick={() => {
            setIsMenuOpen(true)
          }}
          content="Library Options"
        />
      )}
      {!screen?.isMobile && !isDeleteAllConfirmOpen && (
        <div className={styles.infoAndControlsContainer}>
          <div className={styles.infoRow}>
            {!currentScan && <div className={styles.text}><FormattedMessage id="library_total_tracks" values={{ totalTracks }} /></div>}
            {currentScan && <div className={styles.text}><FormattedMessage id="currently_scanning" values={{ currentScan }} /></div>}
            <div className={styles.buttonContainer}>
              {[addButton, discoverButton, deleteAllButton, scanAllButton, categories, showOnlineButton].map((b) => (
                <div className="libraryButton">{b}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LibraryInfoAndGlobalControls;
