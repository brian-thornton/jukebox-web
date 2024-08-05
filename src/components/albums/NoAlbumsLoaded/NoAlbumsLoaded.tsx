import { useIntl } from 'react-intl';

import NoResults from '../../common/NoResults/NoResults';

const NoAlbumsLoaded = () => {
  const intl = useIntl();

  return (
    <NoResults
      title={intl.formatMessage({ id: 'no_albums_loaded_title' })}
      text={intl.formatMessage({ id: 'no_albums_loaded_text' })}
    />
  )
};

export default NoAlbumsLoaded;