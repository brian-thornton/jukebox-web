import { FC, useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../../../common/Buttons/Button/Button';
import CategoryPicker from '../CategoryPicker/CategoryPicker';
import DownloadCoverArtPreference from '../DownloadCoverArtPreference/DownloadCoverArtPreference';
import NameInput from '../../../common/NameInput/NameInput';
import styles from './LibraryAdd.module.css';
import { ILibrary } from '../../../interface';
import { getDirectories } from '../../../../lib/service-clients/file-system-client';
import FolderSelect from '../FolderSelect/FolderSelect';

interface ILibraryAdd {
  setShow: Function,
  setSelectedLibrary: Function,
  handleSave: Function,
  library: ILibrary,
}

const LibraryAdd: FC<ILibraryAdd> = ({
  setShow,
  setSelectedLibrary,
  handleSave,
  library,
}) => {
  const intl = useIntl();
  const [allowCoverArtDownload, setAllowCoverArtDownload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(library?.category || '');
  const [downloadCoverArtDirty, setDownloadCoverArtDirty] = useState(false);
  const [editLibrary, setEditLibrary] = useState(library);
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [directories, setDirectories] = useState<string[]>([]);

  useEffect(() => {
    getDirectories(currentPath).then((data) => {
      setDirectories(data);
    });
  }, [])

  const onSelectDownloadPreference = (value: any) => {
    setAllowCoverArtDownload(value);
    setDownloadCoverArtDirty(true);
  };

  return (
    <div className={styles.addContainer}>
      <div className={styles.text}>
        <FormattedMessage id={library ? 'edit_library' : 'add_library'} />
      </div>
      <div className={styles.nameAndSave}>
        <div style={{ paddingTop: '5px', width: '80vw' }}>
          <NameInput defaultValue={editLibrary?.path} name="Path" placeholder={editLibrary?.path || intl.formatMessage({ id: 'path' })} />
        </div>
        <div style={{ paddingBottom: '10px', display: 'flex', flexDirection: 'row' }}>
          <Button
            content={<FormattedMessage id="cancel" />}
            onClick={() => {
              setShow(false);
              setSelectedLibrary(null);
            }}
          />
          <Button content={<FormattedMessage id="save" />} onClick={() => handleSave(selectedCategory, allowCoverArtDownload)} />
        </div>
      </div>
      <CategoryPicker
        onSelectCategory={(category: any) => {
          setEditLibrary({ ...editLibrary, category });
          setSelectedCategory(category);
        }}
        category={editLibrary?.category || library?.category}
      />
      <DownloadCoverArtPreference library={library} onSelect={onSelectDownloadPreference} />
      {currentPath}
      <FolderSelect onSelect={(directory: string) => (
        setEditLibrary({ ...editLibrary, path: `${currentPath}${directory}/` })
      )} />
    </div>
  );
};

export default LibraryAdd;
