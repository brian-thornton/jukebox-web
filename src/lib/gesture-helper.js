export const handlers = (setSelectedPage, selectedPage) => {
  return {
    onSwipedLeft: () => setSelectedPage(selectedPage + 1),
    onSwipedRight: () => setSelectedPage(selectedPage - 1),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true
  };
};