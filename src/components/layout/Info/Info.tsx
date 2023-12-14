import { useContext } from 'react';
import QRCode from "react-qr-code";
import Button from '../../Button';

import classes from  './Info.module.css';
import { SettingsContext } from '../../layout/SettingsProvider';

const AlbumDetail = () => {
  const settings = useContext(SettingsContext);
  const { styles } = settings;

  return (
    <div className={classes.infoContainer}>
        <div style={{color: styles?.fontColor}} className={classes.headline}>Scan to Connect to Jukebox</div>
        <QRCode value={`http://${settings?.ip}:3000` || ''} size={500} className={classes.qrCode}/>
        <Button style={{marginTop: '20px'}} content="Go Back" onClick={() => window.history.back()} height="60" width="200"  />
    </div>
  );
};

export default AlbumDetail;
