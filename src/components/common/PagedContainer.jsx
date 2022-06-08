import { PropTypes } from 'prop-types';
import React from 'react';
import {
  Container,
  Col,
  Row,
  Navbar,
} from 'react-bootstrap';

import { Paging } from '../shapes';
import Paginator from './Paginator';
import PagingButtons from './PagingButtons';
import { nextPage, previousPage, randomPage } from '../../lib/pageHelper';

const propTypes = {
  clientNextPage: PropTypes.func,
  clientPreviousPage: PropTypes.func,
  content: PropTypes.node.isRequired,
  isHorizontal: PropTypes.bool,
  paging: Paging.isRequired,
  setPaging: PropTypes.func,
};

function PagedContainer({
  clientNextPage,
  clientPreviousPage,
  content,
  paging,
  setPaging,
  isHorizontal,
}) {
  const isScreenSmall = window.innerWidth < 700;

  const margin = () => {
    const marginTop = isHorizontal ? '70px' : '0px';
    return isScreenSmall ? {} : { marginLeft: '0px', marginTop, height: '100%' };
  };

  const pagingButtons = () => {
    if (paging.pages && paging.pages.length > 1) {
      if (setPaging) {
        return (
          <PagingButtons
            loadMore={() => setPaging(nextPage(paging))}
            loadPrevious={() => setPaging(previousPage(paging))}
            loadRandom={() => setPaging(randomPage(paging))}
            pages={paging.pages}
            page={paging.currentPage}
          />
        );
      }

      return (
        <PagingButtons
          loadMore={() => clientNextPage(paging)}
          loadPrevious={() => clientPreviousPage(paging)}
          pages={paging.pages}
          page={paging.currentPage}
        />
      );
    }

    return null;
  };

  return (
    <Container fluid style={margin()}>
      <Row>
        <Col lg="12" xl="12" md="12" sm="12">
          <Row>{content}</Row>
        </Col>
      </Row>
      <Row>
        <Col lg="12" xl="12" md="12" sm="12">
          <Navbar fixed="bottom" style={{paddingBottom: '80px'}} className="justify-content-center">
              {pagingButtons()}
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
}

PagedContainer.defaultProps = {
  clientNextPage: null,
  clientPreviousPage: null,
  isHorizontal: false,
  setPaging: null,
};

PagedContainer.propTypes = propTypes;

export default PagedContainer;
