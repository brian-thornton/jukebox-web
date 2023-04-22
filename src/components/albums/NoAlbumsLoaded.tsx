import { useIntl } from 'react-intl';

import NoResults from '../common/NoResults';

const NoAlbumsLoaded = () => {
  const intl = useIntl();

  return (
    <NoResults
      title={intl.formatMessage({ id: 'no_albums_loaded_title' })}
      text={intl.formatMessage({ id: 'no_albums_loaded_text' })}
      applyMargin={false}
      onGoBack={() => { }}
    />
  )
};

export default NoAlbumsLoaded;