import { useContext } from 'react';
import QRCode from "react-qr-code";
import Button from '../../Button';

import classes from  './Info.module.css';
import { SettingsContext } from '../../layout/SettingsProvider';

const AlbumDetail = () => {
  const settings = useContext(SettingsContext);
  const { preferences, styles } = settings;

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{color: styles?.fontColor}} className={classes.headline}>{preferences?.infoHeading}</div>
        <div style={{color: styles?.fontColor}}>{preferences?.infoContent1}</div>
        <div style={{color: styles?.fontColor}}>{preferences?.infoContent2}</div>
        <QRCode value={`http://${settings?.ip}:3000` || ''} size={500} style={{marginTop: '30px'}}/>
        <Button content="Go Back" onClick={() => window.history.back()} height="100" width="200"  />
    </div>
  );
};

export default AlbumDetail;
