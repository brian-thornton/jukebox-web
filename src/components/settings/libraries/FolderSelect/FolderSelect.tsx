import { FC, useState, useEffect } from 'react';

import Button from '../../../common/Buttons/Button/Button';
import styles from './FolderSelect.module.css';
import { getDirectories } from '../../../../lib/service-clients/file-system-client';

interface IFolderSelect {
  onSelect: Function,
}

const FolderSelect: FC<IFolderSelect> = ({ onSelect }) => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [directories, setDirectories] = useState<string[]>([]);

  useEffect(() => {
    getDirectories(currentPath).then((data) => {
      setDirectories(data);
    });
  }, [])

  const onFolderClick = (directory: string) => {
    setCurrentPath(`${currentPath}${directory}/`);
    getDirectories(`${currentPath}${directory}/`).then((data) => {
      setDirectories(data);
    });
  };

  return (
    <div className={styles.folderSelectContainer}>
      {directories.map((directory) => (
        <div className={styles.directoryRow}>;
          <div className={styles.rowContent}>
            <div onClick={() => onFolderClick(directory)}>
              {directory}
            </div>
            <Button
              content="Select"
              onClick={() => {
                onSelect(`${currentPath}${directory}/`);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FolderSelect;
