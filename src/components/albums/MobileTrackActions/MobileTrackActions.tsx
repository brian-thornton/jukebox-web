import { FC, useContext } from 'react';

import { SettingsContext } from '../../layout/SettingsProvider';
import EnqueueLink from '../../../components/EnqueueLink';
import PlayNowLink from '../../../components/PlayNowLink';
import AddToPlaylistLink from '../../../components/common/AddToPlaylistLink/AddToPlaylistLink';

import { ITrack } from 'components/interface';

interface IMobileTrackActions {
  track: ITrack,
}

const MobileTrackActions: FC<IMobileTrackActions> = ({ track }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '50px' }}>
      {features?.play && <PlayNowLink track={track} />}
      {features?.queue && <EnqueueLink track={track} />}
      {features?.playlists && <AddToPlaylistLink track={track} />}
    </div>
  );
};

export default MobileTrackActions;