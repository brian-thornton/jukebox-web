import { FC, useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

import FontPicker from '../FontPicker/FontPicker';
import Button from '../../../common/Buttons/Button/Button';
import Paginator from '../../../common/Paginator/Paginator';
import { calculatePageSize } from '../../../../lib/helper/styleHelper';
import { handlers } from '../../../../lib/helper/gesture-helper';
import { ISkin } from '../../../interface';
import styles from './SkinFonts.module.css';

interface ISkinFonts {
  onClose: Function,
  skin: ISkin,
}

const SkinFonts: FC<ISkinFonts> = ({ onClose, skin }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(1);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [editFont, setEditFont] = useState<string>();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));
  const [colors, setColors] = useState({
    headerColor: skin.headerColor,
    headerFont: skin.headerFont,
    footerColor: skin.footerColor,
    footerFont: skin.footerFont,
    fontColor: skin.fontColor,
    fontWeight: skin.fontWeight,
    backgroundColor: skin.backgroundColor,
    popupBackgroundColor: skin.popupBackgroundColor,
    buttonBackgroundColor: skin.buttonBackgroundColor,
    activeButtonColor: skin.activeButtonColor,
    buttonFont: skin.buttonFont,
    buttonFontColor: skin.buttonFontColor,
    buttonFontWeight: skin.buttonFontWeight,
    trackBackgroundColor: skin.trackBackgroundColor,
    listFont: skin.listFont,
  });

  useEffect(() => setItemsPerPage(calculatePageSize('item', 250, 70)), []);
  const start = selectedPage === 1 ? 0 : ((selectedPage * itemsPerPage) - itemsPerPage);

  const fontRow = (name: string, display: string) => (
    <div className={styles.fontRow}>
      {display}
      <Button
        disabled={!skin.isEditable}
        // @ts-ignore
        style={{ fontFamily: display }}
        onClick={() => {
          setEditFont(name);
          setIsFontModalOpen(true);
        }}
        // @ts-ignore
        content={colors[name] ? colors[name] : name}
      />
    </div>
  );

  const rows = [
    fontRow('listFont', 'List Font'),
    fontRow('headerFont', 'Header Font'),
    fontRow('footerFont', 'Footer Font'),
    fontRow('buttonFont', 'Button Font'),
  ];

  return (
    <>
      {isFontModalOpen && (
        <FontPicker
          onCancel={() => setIsFontModalOpen(false)}
          skin={skin}
          editFont={editFont}
          onComplete={() => {
            setIsFontModalOpen(false);
            window.location.replace(`/settings?skin=${skin.name}&mode=style&tab=fonts`);
          }}
        />
      )}
      {!isFontModalOpen && (
        <div className={styles.skinFontsContainer}>
          <Button content="Back to Skin" onClick={onClose} />
          {rows.slice(start, (start + itemsPerPage)).map(r => r)}
          <Paginator
            disableRandom
            onPageChange={(page: number) => setSelectedPage(page)}
            totalItems={4}
            pageSize={itemsPerPage}
          />
        </div>
      )}
    </>
  );
};

export default SkinFonts;
