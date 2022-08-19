import ListGroup from 'react-bootstrap/ListGroup';
import React, { useContext, useEffect, useState } from 'react';

import Paginator from '../../common/Paginator';
import CategoryRow from './CategoryRow';
import { SettingsContext } from '../../layout/SettingsProvider';
import { pageSize } from '../../../lib/styleHelper';
import { useSwipeable } from 'react-swipeable';
import { handlers } from '../../../lib/gesture-helper';

const Categories = ({ }) => {
  const settings = useContext(SettingsContext);
  const [selectedPage, setSelectedPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  useEffect(() => setItemsPerPage(pageSize('item')), []);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  return (
    <>
      <ListGroup {...swipe}>
        {settings.categories.slice(start, (start + itemsPerPage)).map((category) => (
          <CategoryRow category={category} />
        ))}
      </ListGroup>
      <Paginator
        disableRandom
        onPageChange={(page) => setSelectedPage(page)}
        selectedPage={selectedPage}
        totalItems={settings.categories.length}
        pageSize={itemsPerPage}
      />
    </>
  );
}

export default Categories;
