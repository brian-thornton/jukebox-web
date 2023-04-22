import { useIntl } from 'react-intl';

import NoResults from '../common/NoResults';

const NoAlbumSearchResults = () => {
  const intl = useIntl();

  return (
    <NoResults
      title={intl.formatMessage({ id: 'no_search_results_title' })}
      text={intl.formatMessage({ id: 'no_search_results_text' })}
      applyMargin={false}
      onGoBack={() => { }}
    />
  )
};

export default NoAlbumSearchResults;