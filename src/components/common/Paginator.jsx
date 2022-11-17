import Button from '../Button';
import {
  ChevronDoubleRight,
  ChevronDoubleLeft,
  ChevronRight,
  ChevronLeft,
} from 'react-bootstrap-icons';
import React, { useContext } from 'react';

import { SettingsContext } from '../layout/SettingsProvider';
import './Paginator.scss';

const Paginator = ({ onPageChange, selectedPage, totalItems, pageSize, disableRandom }) => {
  const settings = useContext(SettingsContext);
  let pages = Math.floor(totalItems / pageSize);
  const { controlButtonSize } = settings.styles;

  let height;
  let fontSize = '';

  if (controlButtonSize === 'large') {
    height = '100';
    fontSize = '40px';
  }

  if (controlButtonSize === 'medium') {
    height = '70'
    fontSize = '30px';
  }

  return (
    <div className="paginator">
      {totalItems > 0 && (
        <Button
          height={height}
          width={height}
          disabled={selectedPage === 1 || settings.features.isLocked}
          onClick={() => onPageChange(1)}
          content={<ChevronDoubleLeft />}
        />
      )}
      <Button
        height={height}
        width={height}
        disabled={selectedPage === 1 || settings.features.isLocked}
        className="paginatorButton"
        onClick={() => onPageChange(selectedPage - 1)}
        content={<ChevronLeft />}
      />
      {!disableRandom && (
        <Button
          height={height}
          hideOnSmall disabled={settings.features.isLocked}
          className="paginatorButton"
          onClick={() => onPageChange(Math.floor(Math.random() * pages))}
          content={`Page ${selectedPage} of ${pages}`} />
      )}
      <Button
        height={height}
        width={height}
        disabled={selectedPage === pages + 1 || settings.features.isLocked}
        className="paginatorButton"
        onClick={() => onPageChange(selectedPage + 1)}
        content={<ChevronRight />}
      />
      {totalItems > 0 && (
        <Button
          height={height}
          width={height}
          disabled={selectedPage === pages + 1 || settings.features.isLocked}
          className="paginatorButton"
          onClick={() => onPageChange(pages + 1)}
          content={<ChevronDoubleRight />}
        />
      )}
    </div>
  );
}

export default Paginator;
