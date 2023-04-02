import {
  ChevronDoubleRight,
  ChevronDoubleLeft,
  ChevronRight,
  ChevronLeft,
} from 'react-bootstrap-icons';
import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import './Paginator.scss';
import { bigButtons } from '../../lib/styleHelper';

interface IPaginator {
  onPageChange: Function,
  selectedPage: number,
  totalItems: number,
  pageSize: number,
  disableRandom: boolean,
};

const Paginator: FC<IPaginator> = ({
  onPageChange,
  selectedPage,
  totalItems,
  pageSize,
  disableRandom,
}) => {
  const settings = useContext(SettingsContext);
  const pages = Math.floor(totalItems / pageSize);
  const fontSize = bigButtons(settings) ? '30px' : '';
  let height;

  if (settings?.styles?.controlButtonSize === 'large') {
    height = '100';
  }

  if (settings?.styles?.controlButtonSize === 'medium') {
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
          disabled={selectedPage === 1 || settings?.features?.isLocked}
          onClick={() => onPageChange(1)}
          content={<ChevronDoubleLeft />}
        />
      )}
      <Button
        {...buttonProps}
        disabled={selectedPage === 1 || settings?.features?.isLocked}
        onClick={() => onPageChange(selectedPage - 1)}
        content={<ChevronLeft />}
      />
      {!disableRandom && (
        <Button
          style={{ fontSize }}
          height={height}
          hideOnSmall
          disabled={settings?.features?.isLocked}
          onClick={() => onPageChange(Math.floor(Math.random() * pages))}
          content={<FormattedMessage id="page_of" values={{ page: selectedPage, pages }} />}
        />
      )}
      <Button
        {...buttonProps}
        disabled={selectedPage === pages + 1 || settings?.features?.isLocked}
        onClick={() => onPageChange(selectedPage + 1)}
        content={<ChevronRight />}
      />
      {totalItems > 0 && (
        <Button
          {...buttonProps}
          disabled={selectedPage === pages + 1 || settings?.features?.isLocked}
          onClick={() => onPageChange(pages + 1)}
          content={<ChevronDoubleRight />}
        />
      )}
    </div>
  );
};

export default Paginator;
