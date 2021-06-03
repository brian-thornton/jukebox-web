import React from 'react';
import {
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import PagingButtons from './PagingButtons';
import { nextPage, previousPage, randomPage } from '../../lib/pageHelper';

function PagedContainer({ content, paging, setPaging, search, isHorizontal, clientNextPage, clientPreviousPage }) {
  const isScreenSmall = window.innerWidth < 700;

  const margin = () => {
    const marginTop = isHorizontal ? '90px' : '0px';
    return isScreenSmall ? {} : { marginLeft: '0px', marginTop: marginTop, height: '100%' }
  };

  const pagingButtons = () => {
    if (setPaging) {
      return (
        <PagingButtons
          search={search}
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
        search={search}
        loadMore={() => clientNextPage(paging)}
        loadPrevious={() => clientPreviousPage(paging)}
        pages={paging.pages}
        page={paging.currentPage}
      />
    );
  }

  return (
    <Container fluid style={margin()}>
      <Row>
        <Col lg={11} xl={11}>
          <Row>{content}</Row>
        </Col>
        <Col lg={1} xl={1}>
          {pagingButtons()}
        </Col>
      </Row>
    </Container>
  );
};

export default PagedContainer;