export const handlers = (setSelectedPage: Function, selectedPage: number, totalPages?: number) => {
  return {
    onSwipedLeft: () => {
      if (totalPages) {
        if (selectedPage < totalPages) {
          setSelectedPage(selectedPage + 1);
        }
      } else {
        setSelectedPage(selectedPage + 1);
      }
    },
    onSwipedRight: () => {
      if (selectedPage > 1) {
        setSelectedPage(selectedPage - 1);
      }
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true
  };
};