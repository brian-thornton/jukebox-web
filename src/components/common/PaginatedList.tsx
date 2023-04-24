import { FC, useContext, isValidElement } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useSwipeable } from 'react-swipeable';

import { handlers } from '../../lib/gesture-helper';
import ExpandRow from './ExpandRow';
import Item from './Item';
import Paginator from './Paginator';
import { topMargin } from '../../lib/styleHelper';
import { SettingsContext } from '../layout/SettingsProvider';
import { IItem } from '../interface';
import FullWidthRow from './FullWidthRow';
import './PaginatedList.scss';

interface IPaginatedList {
  topLevelControls?: any,
  items: Array<any>,
  selectedPage: number,
  totalItems?: number,
  setSelectedPage: Function,
  pageSize: number,
  applyTopMargin?: boolean,
  onItemClick: Function,
};

const PaginatedList: FC<IPaginatedList> = ({
  topLevelControls,
  items,
  selectedPage,
  totalItems,
  setSelectedPage,
  pageSize,
  applyTopMargin = false,
  onItemClick,
}) => {
  const swipe = useSwipeable(
    handlers(setSelectedPage, selectedPage, Math.ceil((totalItems || items?.length) / pageSize)),
  );
  const standardItems = items && items.length > 0 && !isValidElement(items[0]);
  
  const settings = useContext(SettingsContext);
  const { isScreenSmall } = settings;

  return (
    <Container fluid className="paginated-list-container" {...swipe} style={{ marginTop: applyTopMargin ? topMargin(settings) : '' }}>
      {topLevelControls && (
        <FullWidthRow>{topLevelControls}</FullWidthRow>
      )}
      {items && items.length > 0 && (
        <>
          <FullWidthRow>
            <ListGroup className="paginated-list-group">
              <>
                {standardItems && items.map(item => (
                  <>
                    {isScreenSmall && <ExpandRow text={item.text} buttons={item.buttons} setIsExpanded={() => { }} isExpanded={false} />}
                    {!isScreenSmall && (
                      <Item
                        text={item.text}
                        buttons={item.buttons || <></>}
                        onClick={() => {
                          if (onItemClick) {
                            onItemClick(item);
                          }
                        }}
                        onCheck={() => { }}
                        checked={false}
                        actionVisible={false}
                      />
                    )}
                  </>
                ))}
                {!standardItems && items}
              </>
            </ListGroup>
          </FullWidthRow>
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
        </>
      )}
    </Container>
  );
};

export default PaginatedList;
