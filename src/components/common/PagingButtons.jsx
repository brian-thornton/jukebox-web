import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Button } from 'react-bootstrap';
import {
  ChevronRight,
  ChevronLeft,
  Disc,
} from 'react-bootstrap-icons';

import { Page } from '../shapes';
import { findPage } from '../../lib/pageHelper';
import { SettingsContext } from '../layout/SettingsProvider';

const propTypes = {
  loadPrevious: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  loadRandom: PropTypes.func,
  page: Page.isRequired,
  pageDisabled: PropTypes.bool,
  pages: PropTypes.arrayOf(Page).isRequired,
};

function PagingButtons({
  pageDisabled,
  loadMore,
  loadPrevious,
  loadRandom,
  pages,
  page,
}) {
  const settings = useContext(SettingsContext);

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
  } catch (error) {
    // Do nothing to prevent page error.
  }

  const pageOf = () => {
    let result;

    try {
      if (pages.length) {
        result = pages.findIndex(p => p.start === page.start && p.limit === page.limit);
      }
    } catch (error) {
      // Do nothing to prevent page error.
    }

    if (result >= 0) {
      return (
        <div style={{ color: '#FFFFFF' }}>{pages.length ? `${result + 1} of ${pages.length}` : 'Loading...'}</div>
      );
    }

    return null;
  };

  return (
    <>
      <Button style={{ ...pageButtonProps, marginTop: '20px' }} disabled={pageDisabled || nextDisabled} block variant="outline-light" onClick={loadMore}><ChevronRight /></Button>
      <Button style={{ ...pageButtonProps, marginTop: '10px' }} disabled={pageDisabled || previousDisabled} block variant="outline-light" onClick={loadPrevious}><ChevronLeft /></Button>
      {loadRandom && <Button style={{ ...pageButtonProps, marginTop: '10px' }} disabled={pageDisabled} block variant="outline-light" onClick={loadRandom}><Disc /></Button>}
      {pageOf()}
    </>
  );
}

PagingButtons.defaultProps = {
  pageDisabled: false,
  loadRandom: null,
};

PagingButtons.propTypes = propTypes;

export default PagingButtons;
