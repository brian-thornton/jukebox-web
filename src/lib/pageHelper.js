const getWidth = () => {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

const getHeight = () => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

const pageRows = () => {
  return Math.floor(getHeight() / 300);
}

const calculatePages = (totalAlbums, pageSize) => {
  const calcPages = [];

  let counter = 1;
  let albumCounter = 0;
  let pageStart = 0;
  while (albumCounter <= totalAlbums) {
    if (counter === pageSize) {
      calcPages.push({ start: pageStart, limit: albumCounter });
      counter = 0;
      pageStart = albumCounter + 1;
    } else {


      counter += 1;
    }
    albumCounter += 1;
  }
  return calcPages;
}

export {
  getHeight,
  getWidth,
  calculatePages,
  pageRows,
}