import { useIntl } from 'react-intl';

import NoResults from '../../common/NoResults/NoResults';

const NoAlbumSearchResults = () => {
  const intl = useIntl();

  return (
    <NoResults
      title={intl.formatMessage({ id: 'no_search_results_title' })}
      text={intl.formatMessage({ id: 'no_search_results_text' })}
    />
  )
};

export default NoAlbumSearchResults;