import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from 'react-bootstrap';
import {
  ChevronRight,
  ChevronLeft,
  Disc,
} from 'react-bootstrap-icons';

import { Settings, Page } from '../shapes';
import { findPage } from '../../lib/pageHelper';

const propTypes = {
  loadPrevious: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  page: Page.isRequired,
  pages: PropTypes.arrayOf(Page).isRequired,
  settings: Settings.isRequired,
  setCurrentAlbum: PropTypes.func.isRequired,
};

function PagingButtons({
  settings,
  search,
  pageDisabled,
  loadMore,
  loadPrevious,
  loadRandom,
  pages,
  page,
}) {
  const isScreenSmall = window.innerWidth < 700;
  const isMedium = window.innerWidth >= 700 && window.innerWidth < 1200

  if (!search) {
    const pageButtonProps = {
      background: settings.styles.buttonBackgroundColor,
      height: '75px',
      color: settings.styles.fontColor,
    };

    let nextDisabled = true;
    let previousDisabled = true;

    try {
      nextDisabled = findPage(pages, page) === (pages.length - 1);
      previousDisabled = findPage(pages, page) === 0;
    } catch
    {

    }

    const pageOf = () => {
      let page;

      try {
        if (pages.length) {
          page = pages.findIndex(p => p.start === page.start && p.limit === page.limit)
        }
      } catch {

      }

      if (page) {
        return (
          <div style={{ color: '#FFFFFF' }}>{pages.length ? `${page} of ${pages.length}` : 'Loading...'}</div>
        )
      }

      return null;
    }

    const next = isMedium ? <ChevronRight /> : 'Next';
    const previous = isMedium ? <ChevronLeft /> : 'Previous';
    const random = isMedium ? <Disc /> : 'Random';

    return (
      <React.Fragment>
        <Button style={{ ...pageButtonProps, marginTop: '20px' }} disabled={pageDisabled || nextDisabled} block variant="outline-light" onClick={loadMore}><ChevronRight /></Button>
        <Button style={{ ...pageButtonProps, marginTop: '10px' }} disabled={pageDisabled || previousDisabled} block variant="outline-light" onClick={loadPrevious}><ChevronLeft /></Button>
        {loadRandom && <Button style={{ ...pageButtonProps, marginTop: '10px' }} disabled={pageDisabled} block variant="outline-light" onClick={loadRandom}><Disc /></Button>}
        {pageOf()}
      </React.Fragment>
    );
  }

  return null;
}

PagingButtons.propTypes = propTypes;

export default PagingButtons;
