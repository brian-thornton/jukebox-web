import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { FC, useContext } from 'react';

import { handlers } from '../../../lib/helper/gesture-helper';
import { SettingsContext } from '../../layout/SettingsProvider';
import AlbumCover from '../AlbumCover/AlbumCover';
import { IAlbum } from '../../interface';
import styles from './VerticalAlbumList.module.css';

interface IAlbumList {
  albums?: Array<IAlbum>,
  selectedPage: number,
  setSelectedPage: Function,
}

const AlbumList: FC<IAlbumList> = ({
  albums,
  selectedPage,
  setSelectedPage
}) => {
  const settings = useContext(SettingsContext);
  const navigate = useNavigate();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  const itemStyle = {
    background: 'settings?.styles?.trackBackgroundColor',
    color: settings?.styles?.fontColor,
    margin: '3px',
    padding: '0px',
  };

  return (
    <div {...swipe} className={styles.verticalAlbumContainer}>
      {albums?.map((album: IAlbum) => (
        <div key={album.path} style={itemStyle}>
          <div className={styles.listContainer}
            onClick={() => {
              navigate(`/albums/${album.id}`, { state: { currentAlbum: album, prevUrl: window.location.pathname } });
            }}>
            <AlbumCover album={album} isListCover={true} />
            <div className={styles.albumName}>
              {album.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlbumList;
