import PropTypes from 'prop-types';

export const Album = PropTypes.shape({
  name: PropTypes.string,
  path: PropTypes.string,
  coverArtExists: PropTypes.bool,
  trackCount: PropTypes.number,
});
