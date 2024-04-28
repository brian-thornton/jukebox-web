import { useSwipeable } from 'react-swipeable';
import { FC, useContext } from 'react';

import { handlers } from '../../../lib/helper/gesture-helper';
import { SettingsContext } from '../../layout/SettingsProvider';
import Album from '../Album/Album';
import AlbumTable from '../AlbumTable/AlbumTable';
import Paginator from '../../common/Paginator/Paginator';
import StartsWithFilter from '../StartsWithFilter/StartsWithFilter';
import { usePageSize } from '../album-hooks';
import { IAlbum } from '../../interface';
import styles from './AlbumCoverList.module.css';

interface IAlbumCoverList {
  setStartsWithFilter?: Function,
  startsWithFilter?: string,
  display: string,
  search: string,
  albums: Array<IAlbum>,
  totalAlbums: number,
  selectedPage: number,
  setSelectedPage: Function,
}

const AlbumCoverList: FC<IAlbumCoverList> = ({
  albums, display, search, totalAlbums, setStartsWithFilter, startsWithFilter, selectedPage, setSelectedPage,
}) => {
  const settings = useContext(SettingsContext);
  const { preferences, screen } = settings;
  const { startsWithLocation } = preferences || {};
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const pageSize = screen?.isMobile ? 6 : usePageSize(display, settings);

  const paginator = (
    <Paginator
      onPageChange={(page: any) => setSelectedPage(page)}
      totalItems={totalAlbums}
      pageSize={pageSize}
      disableRandom={search?.length > 0 || display !== 'covers'}
    />
  );

  const startsWithCol = (
    <div className={styles.startsWith}>
      <StartsWithFilter
        startsWithFilter={startsWithFilter}
        setStartsWithFilter={setStartsWithFilter}
      />
    </div >
  );

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {startsWithLocation === 'left' && !screen?.isTabletOrSmaller && !search && startsWithCol}
        <div className={styles.albumContainer} {...swipe}>
          {display !== 'grid' && albums.map(album => <Album album={album} coverArtOnly={false} />)}
          {display === 'grid' && <AlbumTable albums={albums} />}
        </div>
        {startsWithLocation === 'right' && !screen?.isTabletOrSmaller && !search && startsWithCol}
      </div>
      {(totalAlbums > pageSize) && !screen?.isTabletOrSmaller && (
          <div className={styles.paginator}>
            {paginator}
          </div>
        )}
    </div >
  )
};

export default AlbumCoverList;
