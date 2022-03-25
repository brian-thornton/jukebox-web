import Button from '../Button';
import {
  ChevronDoubleRight,
  ChevronDoubleLeft,
  ChevronRight,
  ChevronLeft,
} from 'react-bootstrap-icons';
import React from 'react';

const Paginator = ({ onPageChange, selectedPage, totalItems, pageSize, disableRandom }) => {
  let pages = Math.floor(totalItems / pageSize);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Button disabled={selectedPage === 1} onClick={() => onPageChange(1)} content={<ChevronDoubleLeft />} />
      <Button disabled={selectedPage === 1} style={{ marginLeft: '5px' }} onClick={() => onPageChange(selectedPage - 1)} content={<ChevronLeft />} />
      {!disableRandom && (<Button style={{ marginLeft: '5px' }} onClick={() => onPageChange(Math.floor(Math.random() * pages))} content={`Page ${selectedPage} of ${pages}`} />)}
      <Button disabled={selectedPage === pages + 1} style={{ marginLeft: '5px' }} onClick={() => onPageChange(selectedPage + 1)} content={<ChevronRight />} />
      <Button disabled={selectedPage === pages + 1} style={{ marginLeft: '5px' }} onClick={() => onPageChange(pages + 1)} content={<ChevronDoubleRight />} />
    </div>
  );
}

export default Paginator;
