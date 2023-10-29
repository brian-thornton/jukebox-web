import { useEffect, useState } from 'react';

import { coverArtUrl, saveCoverArt } from '../../../lib/service-clients/librarian-client';

export const useCoverArt = (album, settings) => {
  const [coverArt, setCoverArt] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (album.coverArtExists || settings?.features?.admin) {
      coverArtUrl(album, settings?.styles?.defaultAlbumCover).then((data) => {
        setCoverArt(data.url);

        if (!data.isLocal && !data.isDefault) {
          saveCoverArt({ album, url: data.url });
        }

        setLoading(false);
      });
    }
  }, [album, settings, saveCoverArt, loading]);

  return {
    coverArt,
    loading,
  }
};