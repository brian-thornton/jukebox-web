import { useIntl } from 'react-intl';

import NoResults from '../../common/NoResults/NoResults';

const NoPlaylists = () => {
  const intl = useIntl();

  return (
    <NoResults
      title={intl.formatMessage({ id: 'no_playlists_title' })}
      text={intl.formatMessage({ id: 'no_playlists_text' })}
    />
  )
};

export default NoPlaylists;