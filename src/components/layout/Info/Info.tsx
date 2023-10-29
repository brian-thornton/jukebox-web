import { useContext } from 'react';
import QRCode from "react-qr-code";
import Button from '../../Button';

import styles from  './Info.module.css';
import { SettingsContext } from '../../layout/SettingsProvider';
import { topMargin } from '../../../lib/helper/styleHelper';

const AlbumDetail = () => {
  const settings = useContext(SettingsContext);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: topMargin(settings) }}>
        <div style={{color: settings?.styles?.fontColor}} className={styles.headline}>{settings?.preferences?.infoHeading}</div>
        <div style={{color: settings?.styles?.fontColor}}>{settings?.preferences?.infoContent1}</div>
        <div style={{color: settings?.styles?.fontColor}}>{settings?.preferences?.infoContent2}</div>
        <QRCode value={`http://${settings?.ip}:3000` || ''} size={500} style={{marginTop: '30px'}}/>
        <Button content="Go Back" onClick={() => window.history.back()} height="100" width="200"  />
    </div>
  );
};

export default AlbumDetail;
