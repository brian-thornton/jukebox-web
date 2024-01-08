import { FC, isValidElement } from 'react';
import { useSwipeable } from 'react-swipeable';

import { handlers } from '../../../lib/helper/gesture-helper';
import Item from '../Item/Item';
import Paginator from '../Paginator/Paginator';
import styles from './PaginatedList.module.css';

interface IPaginatedList {
  topLevelControls?: any,
  items: Array<any>,
  selectedPage: number,
  totalItems?: number,
  setSelectedPage: Function,
  pageSize: number,
  applyTopMargin?: boolean,
  onItemClick: Function,
  hideButtons?: boolean,
}

const PaginatedList: FC<IPaginatedList> = ({
  topLevelControls,
  items,
  selectedPage,
  totalItems,
  setSelectedPage,
  pageSize,
  hideButtons = false,
}) => {
  const swipe = useSwipeable(
    handlers(setSelectedPage, selectedPage, Math.ceil((totalItems || items?.length) / pageSize)),
  );
  const standardItems = items && items.length > 0 && !isValidElement(items[0]);

  return (
    <div className={styles.paginatedListContainer} {...swipe} style={{ paddingLeft: 0, paddingRight: 0 }}>
      {topLevelControls && (
        {topLevelControls}
      )}
      {items && items.length > 0 && (
        <>
          <div className={styles.paginatedListGroup}>
            {standardItems && items.map(item => (
              <Item
                text={item.text}
                buttons={item.buttons || <></>}
                onClick={(a: any) => {
                  if (item.onItemClick) {
                    item.onItemClick();
                  }
                }}
                onCheck={() => { }}
                checked={false}
                actionVisible={false}
              />
            ))}
            {!standardItems && items}
          </div>
          {!hideButtons && (
            <>
              {Math.ceil((totalItems || items.length) / pageSize) > 1 && (
                <Paginator
                  disableRandom
                  onPageChange={(page: any) => setSelectedPage(page)}
                  selectedPage={selectedPage}
                  totalItems={totalItems || items.length}
                  pageSize={pageSize}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PaginatedList;
