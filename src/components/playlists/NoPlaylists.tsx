import { useIntl } from 'react-intl';

import NoResults from '../common/NoResults';

const NoPlaylists = () => {
  const intl = useIntl();

  return (
    <NoResults
      title={intl.formatMessage({ id: 'no_playlists_title' })}
      text={intl.formatMessage({ id: 'no_playlists_text' })}
      applyMargin={false}
      onGoBack={() => { }}
    />
  )
};

export default NoPlaylists;