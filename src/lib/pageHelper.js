const getWidth = () => {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
};

const getHeight = () => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
};

const pageRows = (initialHeight, contentHeight) => {
  return Math.floor(initialHeight / contentHeight);
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
  return Math.floor(getWidth() / 500) * pageRows(pageHeight, itemHeight);
};

const initializePaging = (totalItems, itemHeight, pageHeight) => {
  const itemPageSize = pageSize(pageHeight, itemHeight);
  const currentPage = { start: 0, limit: itemPageSize - 1 };
  const pages = calculatePages(totalItems, itemPageSize);

  return {
    pageSize: itemPageSize,
    currentPage,
    pages
  };
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

export {
  randomPage,
  initializePaging,
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
};