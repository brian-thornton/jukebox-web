import React, { useContext } from 'react';
import {
  Container,
  Row,
  Col,
  ListGroup,
} from 'react-bootstrap';
import { useSwipeable } from 'react-swipeable';
import PropTypes from 'prop-types';

import { handlers } from '../../lib/gesture-helper';
import ExpandRow from './ExpandRow';
import Item from './Item';
import Paginator from './Paginator';
import { topMargin } from '../../lib/styleHelper';
import { SettingsContext } from '../layout/SettingsProvider';
import { Items } from '../shapes';

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
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage, Math.ceil((totalItems || items?.length) / pageSize)));
  const isScreenSmall = window.innerWidth < 700;
  const standardItems = items && items.length > 0 && items[0].text;
  const settings = useContext(SettingsContext);

  return (
    <Container fluid {...swipe} style={{ width: '100%', marginTop: applyTopMargin ? topMargin(settings) : '' }}>
      {topLevelControls && (
        <Row>
          {topLevelControls}
        </Row>
      )}
      {items && items.length > 0 && (
        <>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row>
                <ListGroup style={{ width: '100%' }}>
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
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              {Math.ceil((totalItems || items.length) / pageSize) > 1 && (
                <Paginator
                  disableRandom
                  onPageChange={page => setSelectedPage(page)}
                  selectedPage={selectedPage}
                  totalItems={totalItems || items.length}
                  pageSize={pageSize}
                />
              )}
            </Col>
          </Row>
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
