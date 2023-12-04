import { FC, isValidElement } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useSwipeable } from 'react-swipeable';

import { handlers } from '../../../lib/helper/gesture-helper';
import Item from '../Item/Item';
import Paginator from '../Paginator/Paginator';
import FullWidthRow from '../FullWidthRow/FullWidthRow';
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
    <Container fluid className="paginated-list-container" {...swipe} style={{ paddingLeft: 0, paddingRight: 0 }}>
      {topLevelControls && (
        <FullWidthRow className={styles.controlClass}>{topLevelControls}</FullWidthRow>
      )}
      {items && items.length > 0 && (
        <>
          <FullWidthRow>
            <ListGroup className="paginated-list-group">
              <>
                {standardItems && items.map(item => (
                  <>
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
                  </>
                ))}
                {!standardItems && items}
              </>
            </ListGroup>
          </FullWidthRow>
          {!hideButtons && (
            <FullWidthRow>
              {Math.ceil((totalItems || items.length) / pageSize) > 1 && (
                <Paginator
                  disableRandom
                  onPageChange={(page: any) => setSelectedPage(page)}
                  selectedPage={selectedPage}
                  totalItems={totalItems || items.length}
                  pageSize={pageSize}
                />
              )}
            </FullWidthRow>
          )}
        </>
      )}
    </Container>
  );
};

export default PaginatedList;
