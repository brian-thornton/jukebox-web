import Container from 'react-bootstrap/Container';
import { FC, useState, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { PlayFill } from 'react-bootstrap-icons';

import Button from '../../common/Buttons/Button/Button';
import { play } from '../../../lib/service-clients/radio-client';
import RadioCategories from '../RadioCategories/RadioCategories';
import RadioCategoriesMobile from '../RadioCategoriesMobile/RadioCategoriesMobile';
import { SettingsContext } from '../../layout/SettingsProvider';
import styles from './RadioList.module.css';
import PaginatedList from '../../common/PaginatedList/PaginatedList';
import { useStations } from '../../../hooks/use-stations';

interface IRadioList {
  setMediaType: Function,
}

const RadioList: FC<IRadioList> = ({ setMediaType }) => {
  const settings = useContext(SettingsContext);
  const { preferences, screen, rowPageSize } = settings;
  const [selectedCategory, setSelectedCategory] = useState('rock');
  const [selectedPage, setSelectedPage] = useState(1);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const { stations } = useStations(selectedCategory, selectedPage, rowPageSize);

  const tune = (station: any) => {
    setMediaType('stream');
    play(station.url_resolved, preferences?.vlcHost,
      preferences?.vlcPort, preferences?.vlcPassword);
  };

  const itemButtons = (station: any) => (
    <Button
      content={<PlayFill />}
      onClick={() => tune(station)}
    />
  );

  const items = () => stations.map((station: any) => (
    {
      text: station.name,
      buttons: itemButtons(station),
      onItemClick: () => tune(station),
    }
  ));

  const StationList = () => (rowPageSize && rowPageSize > 0) ? (
    <PaginatedList
      // @ts-ignore
      items={items()}
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      pageSize={rowPageSize}
      onItemClick={() => { }}
      totalItems={300}
    />
  ) : <></>;

  return (
    <>
      {screen?.isMobile && !isGenreOpen && (
        <>
          <Button style={{ fontSize: '20px' }} content="..." onClick={() => setIsGenreOpen(true)} />
          <Container className={styles.stationsContainer} fluid style={{ paddingLeft: '0', paddingRight: '0' }}>
            <Row>
              {stations?.length > 0 && (
                <StationList />
              )}
            </Row>
          </Container>
        </>
      )}
      {screen?.isMobile && isGenreOpen && (
        <RadioCategoriesMobile category={selectedCategory} setCategory={setSelectedCategory} onClose={() => setIsGenreOpen(false)} />
      )}
      {!screen?.isMobile && !isGenreOpen && (
        <Container className={styles.stationsContainer} fluid style={{ paddingLeft: '0', paddingRight: '0' }}>
          <Row>
            <Col lg="1" xl="1" md="1" sm="1">
              <RadioCategories category={selectedCategory} setCategory={setSelectedCategory} />
            </Col>
            <Col lg="11" xl="11" md="11" sm="11">
              {stations?.length > 0 && (
                <StationList />
              )}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default RadioList;
