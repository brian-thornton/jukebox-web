import {
  ChevronDoubleRight,
  ChevronDoubleLeft,
  ChevronRight,
  ChevronLeft,
} from 'react-bootstrap-icons';
import { FC, useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../Buttons/Button/Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import classes from './Paginator.module.css';

interface IPaginator {
  onPageChange: Function,
  totalItems: number,
  pageSize: number,
  disableRandom?: boolean,
}

const Paginator: FC<IPaginator> = ({
  onPageChange,
  totalItems,
  pageSize,
  disableRandom,
}) => {
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const { styles, features } = settings || {};
  const pages = Math.floor(totalItems / pageSize);
  let height;

  if (styles?.controlButtonSize === 'large') {
    height = '100';
  }

  if (styles?.controlButtonSize === 'medium') {
    height = '70';
  }

  const buttonProps = {
    height,
    width: height,
  };

  const changePage = (newValue: number) => {
    onPageChange(newValue);
    setSelectedPage(newValue);
  }

  return (
    <div className={classes.paginator}>
      {totalItems > 0 && (
        <Button
          {...buttonProps}
          disabled={selectedPage === 1 || features?.isLocked}
          onClick={() => changePage(1)}
          content={<ChevronDoubleLeft />}
        />
      )}
      <Button
        {...buttonProps}
        disabled={selectedPage === 1 || features?.isLocked}
        onClick={() => changePage(selectedPage - 1)}
        content={<ChevronLeft />}
      />
      {!disableRandom && (
        <Button
          height={height}
          hideOnSmall
          disabled={features?.isLocked}
          onClick={() => changePage(Math.floor(Math.random() * pages))}
          content={<FormattedMessage id="page_of" values={{ page: selectedPage, pages }} />}
        />
      )}
      <Button
        {...buttonProps}
        disabled={selectedPage === pages + 1 || features?.isLocked}
        onClick={() => changePage(selectedPage + 1)}
        content={<ChevronRight />}
      />
      <Button
        {...buttonProps}
        disabled={selectedPage === pages + 1 || features?.isLocked}
        onClick={() => changePage(pages + 1)}
        content={<ChevronDoubleRight />}
      />
    </div>
  );
};

export default Paginator;
