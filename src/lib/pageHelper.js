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

const trackPageRows = () => {
  return Math.floor(getHeight() / 200);
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
}

const getRandomInt = (pageCount) => {
  const min = Math.ceil(0);
  const max = Math.floor(pageCount);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export {
  getHeight,
  getWidth,
  calculatePages,
  pageRows,
  trackPageRows,
  calculateTrackPages,
  getRandomInt,
}