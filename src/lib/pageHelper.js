import { getStatus, updateStatus } from './status-client';

const getWidth = () => {
  const isScreenSmall = window.innerWidth < 700;
  const isLarge = window.innerWidth > 1200;

  let width = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );

  if (isLarge) {
    width = width - 200;
  }

  return width;
};

const getHeight = () => {
  return window.innerHeight;
};

const pageRows = (initialHeight, contentHeight) => {
  const rows = Math.floor((initialHeight - 100)/ contentHeight);
  return rows;
};

const findPage = (pages, page) => {
  return pages.findIndex(p => p.start === page.start && p.limit === page.limit)
};

const calculatePages = (totalItems, pageSize) => {
  const calcPages = [];

  let counter = 1;
  let itemCounter = 0;
  let pageStart = 0;
  while (itemCounter <= totalItems) {
    if (counter === pageSize) {
      calcPages.push({ start: pageStart, limit: itemCounter });
      counter = 0;
      pageStart = itemCounter + 1;
    } else {
      counter += 1;
    }
    itemCounter += 1;
  }

  calcPages.push({ start: pageStart, limit: itemCounter })
  return calcPages;
};

const calculateTrackPages = (totalTracks, pageSize) => {
  const calcPages = [];

  let counter = 1;
  let trackCounter = 0;
  let pageStart = 0;
  while (trackCounter <= totalTracks) {
    if (counter === pageSize) {
      calcPages.push({ start: pageStart, limit: trackCounter });
      counter = 0;
      pageStart = trackCounter + 1;
    } else {


      counter += 1;
    }
    trackCounter += 1;
  }
  return calcPages;
};

const getRandomInt = (pageCount) => {
  const min = Math.ceil(0);
  const max = Math.floor(pageCount);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

const pageSize = (pageHeight, itemHeight) => {
  return Math.floor(getHeight() / itemHeight);
};

const rowSize = (itemWidth) => {
  const isMedium = window.innerWidth >= 700 && window.innerWidth < 1200
  return Math.floor((getWidth() - 100) / itemWidth);
}

const initHorizontalPaging = (totalItems, itemHeight, pageHeight, itemWidth) => {
  const itemPageSize = pageRows(pageHeight, itemHeight) * rowSize(itemWidth);
  const currentPage = { start: 0, limit: itemPageSize - 1 };
  const pages = calculatePages(totalItems, itemPageSize);

  const paging = {
    pageSize: itemPageSize,
    currentPage,
    pages
  };

  return paging;
}

const initializePaging = (totalItems, itemHeight, pageHeight) => {
  const itemPageSize = pageSize(pageHeight, itemHeight);
  const currentPage = { start: 0, limit: itemPageSize - 1 };
  const pages = calculatePages(totalItems, itemPageSize);

  const paging = {
    pageSize: itemPageSize,
    currentPage,
    pages
  };

  return paging;
}

const nextPage = (paging) => {
  return {
    ...paging,
    currentPage: paging.pages[findPage(paging.pages, paging.currentPage) + 1]
  };
};

const previousPage = (paging) => {
  return {
    ...paging,
    currentPage: paging.pages[findPage(paging.pages, paging.currentPage) - 1]
  };
};

const randomPage = (paging) => {
  return {
    ...paging,
    currentPage: paging.pages[getRandomInt(paging.pages.length)],
  }
};

const setKnownPage = (paging, page) => {
  return {
    ...paging,
    currentPage: paging.pages[findPage(paging.pages, page)],
  }
};

const saveCurrentPage = async (page, type) => {
  const status = await getStatus();
  updateStatus({
    ...status,
    currentPages: {
      ...status.currentPages,
      [type]: page
    }
  })
};

const clearCurrentPage = async (type) => {
  const status = await getStatus();
  await updateStatus({
    ...status,
    currentPages: {
      ...status.currentPages,
      [type]: null
    }
  })
};

export {
  randomPage,
  initializePaging,
  initHorizontalPaging,
  nextPage,
  previousPage,
  getHeight,
  getWidth,
  calculatePages,
  pageRows,
  calculateTrackPages,
  getRandomInt,
  findPage,
  pageSize,
  saveCurrentPage,
  setKnownPage,
  clearCurrentPage,
};