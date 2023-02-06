import React, { useContext } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useSwipeable } from 'react-swipeable';
import PropTypes from 'prop-types';

import { handlers } from '../../lib/gesture-helper';
import ExpandRow from './ExpandRow';
import Item from './Item';
import Paginator from './Paginator';
import { topMargin } from '../../lib/styleHelper';
import { SettingsContext } from '../layout/SettingsProvider';
import { Items } from '../shapes';
import FullWidthRow from './FullWidthRow';
import './PaginatedList.scss';

const propTypes = {
  topLevelControls: PropTypes.node,
  items: Items,
  selectedPage: PropTypes.number,
  totalItems: PropTypes.number,
  setSelectedPage: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  applyTopMargin: PropTypes.bool,
  onItemClick: PropTypes.func,
};

const PaginatedList = ({
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
  const standardItems = items && items.length > 0 && items[0].text;
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
                    {isScreenSmall && <ExpandRow text={item.text} buttons={item.buttons} />}
                    {!isScreenSmall && (
                      <Item
                        text={item.text}
                        buttons={item.buttons || <></>}
                        onClick={() => onItemClick(item)}
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
                onPageChange={page => setSelectedPage(page)}
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

PaginatedList.defaultProps = {
  topLevelControls: null,
  items: null,
  selectedPage: null,
  totalItems: null,
  pageSize: null,
  applyTopMargin: null,
  onItemClick: () => { },
};

PaginatedList.propTypes = propTypes;

export default PaginatedList;
