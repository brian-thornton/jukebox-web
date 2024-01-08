import { FC, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../../../common/Button/Button';
import CategoryPicker from '../CategoryPicker/CategoryPicker';
import DownloadCoverArtPreference from '../DownloadCoverArtPreference/DownloadCoverArtPreference';
import NameInput from '../../../common/NameInput/NameInput';
import styles from './LibraryAdd.module.css';
import { ILibrary } from '../../../interface';

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

  const onSelectDownloadPreference = (value: any) => {
    setAllowCoverArtDownload(value);
    setDownloadCoverArtDirty(true);
  };

  return (
    <div className={styles.addContainer}>
      <div className={styles.text}>
        <FormattedMessage id={library ? 'edit_library' : 'add_library'} />
      </div>
      <NameInput name="Path" placeholder={editLibrary?.path || intl.formatMessage({ id: 'path' })} />
      <CategoryPicker
        onSelectCategory={(category: any) => {
          setEditLibrary({ ...editLibrary, category });
          setSelectedCategory(category);
        }}
        category={editLibrary?.category || library?.category}
      />
      <DownloadCoverArtPreference library={library} onSelect={onSelectDownloadPreference} />
      <div className={styles.buttonRow}>
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
  );
};

export default LibraryAdd;
