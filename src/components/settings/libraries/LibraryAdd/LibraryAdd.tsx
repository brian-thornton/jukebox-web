import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { FC, useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../../../Button';
import CategoryPicker from '../CategoryPicker/CategoryPicker';
import DownloadCoverArtPreference from '../DownloadCoverArtPreference/DownloadCoverArtPreference';
import NameInput from '../../../common/NameInput/NameInput';
import { SettingsContext } from '../../../layout/SettingsProvider';
import './LibraryAdd.scss';
import { ILibrary } from '../../../interface';

interface ILibraryAdd {
  setShow: Function,
  setSelectedLibrary: Function,
  handleSave: Function,
  library: ILibrary,
}

const LibraryAdd: FC<ILibraryAdd> = ({
  setShow,
  setSelectedLibrary,
  handleSave,
  library,
}) => {
  const intl = useIntl();
  const settings = useContext(SettingsContext);
  const [allowCoverArtDownload, setAllowCoverArtDownload] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(library?.category || '');
  const [downloadCoverArtDirty, setDownloadCoverArtDirty] = useState(false);
  const { isScreenSmall } = settings;
  const [editLibrary, setEditLibrary] = useState(library);

  const confirmStyle = {
    marginTop: isScreenSmall ? '60px' : '0px',
    color: settings?.styles?.fontColor,
  };

  const onSelectDownloadPreference = (value: any) => {
    setAllowCoverArtDownload(value);
    setDownloadCoverArtDirty(true);
  };

  return (
    <Card className="addNewCard" style={confirmStyle}>
      <Card.Title><FormattedMessage id={library ? 'edit_library' : 'add_library'} /></Card.Title>
      <Card.Body style={{ background: settings?.styles?.trackBackgroundColor }}>
        <Container fluid className="addContainer">
          <Row>
            <NameInput name="Path" placeholder={editLibrary?.path || intl.formatMessage({ id: 'path' })} />
          </Row>
          <Row>
            <CategoryPicker
              onSelectCategory={(category: any) => {
                setEditLibrary({ ...editLibrary, category });
                setSelectedCategory(category);
              }}
              category={editLibrary?.category || library?.category}
            />
          </Row>
          <Row>
            <DownloadCoverArtPreference library={library} onSelect={onSelectDownloadPreference} />
          </Row>
        </Container>
        <Button
          content={<FormattedMessage id="cancel" />}
          onClick={() => {
            setShow(false);
            setSelectedLibrary(null);
          }}
        />
        <Button content={<FormattedMessage id="save" />} disabled={!downloadCoverArtDirty} onClick={() => handleSave(selectedCategory, allowCoverArtDownload)} />
      </Card.Body>
    </Card>
  );
};

export default LibraryAdd;
