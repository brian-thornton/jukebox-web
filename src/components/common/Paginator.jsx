import {
  ChevronDoubleRight,
  ChevronDoubleLeft,
  ChevronRight,
  ChevronLeft,
} from 'react-bootstrap-icons';
import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import './Paginator.scss';
import { bigButtons } from '../../lib/styleHelper';

const propTypes = {
  onPageChange: PropTypes.func.isRequired,
  selectedPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number,
  pageSize: PropTypes.number.isRequired,
  disableRandom: PropTypes.bool,
};

const Paginator = ({
  onPageChange,
  selectedPage,
  totalItems,
  pageSize,
  disableRandom,
}) => {
  const settings = useContext(SettingsContext);
  const pages = Math.floor(totalItems / pageSize);
  const { controlButtonSize } = settings.styles;
  const fontSize = bigButtons(settings) ? '30px' : '';
  let height;

  if (controlButtonSize === 'large') {
    height = '100';
  }

  if (controlButtonSize === 'medium') {
    height = '70';
  }

  const buttonProps = {
    style: { fontSize },
    height,
    width: height,
  };

  return (
    <div className="paginator">
      {totalItems > 0 && (
        <Button
          {...buttonProps}
          disabled={selectedPage === 1 || settings.features.isLocked}
          onClick={() => onPageChange(1)}
          content={<ChevronDoubleLeft />}
        />
      )}
      <Button
        {...buttonProps}
        disabled={selectedPage === 1 || settings.features.isLocked}
        className="paginatorButton"
        onClick={() => onPageChange(selectedPage - 1)}
        content={<ChevronLeft />}
      />
      {!disableRandom && (
        <Button
          style={{ fontSize }}
          height={height}
          hideOnSmall
          disabled={settings.features.isLocked}
          className="paginatorButton"
          onClick={() => onPageChange(Math.floor(Math.random() * pages))}
          content={<FormattedMessage id="page_of" values={{ page: selectedPage, pages }} />}
        />
      )}
      <Button
        {...buttonProps}
        disabled={selectedPage === pages + 1 || settings.features.isLocked}
        className="paginatorButton"
        onClick={() => onPageChange(selectedPage + 1)}
        content={<ChevronRight />}
      />
      {totalItems > 0 && (
        <Button
          {...buttonProps}
          disabled={selectedPage === pages + 1 || settings.features.isLocked}
          className="paginatorButton"
          onClick={() => onPageChange(pages + 1)}
          content={<ChevronDoubleRight />}
        />
      )}
    </div>
  );
};

Paginator.defaultProps = {
  disableRandom: true,
  totalItems: null,
};

Paginator.propTypes = propTypes;

export default Paginator;
