import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Col, Row } from 'react-bootstrap';

import Button from '../Button';
import Paginator from '../common/Paginator';
import { getStations, play } from '../../lib/radio-client';
import Item from '../common/Item';
import RadioCategories from './RadioCategories';
import { SettingsContext } from '../layout/SettingsProvider';
import './RadioList.scss';
import { handlers } from '../../lib/gesture-helper';
import { topMargin } from '../../lib/styleHelper';

const RadioList = ({ setMediaType }) => {
  const settings = useContext(SettingsContext);
  const { preferences } = settings;
  const [selectedCategory, setSelectedCategory] = useState('rock');
  const [stations, setStations] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  const loadStations = async () => {
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

    const stations = await getStations(selectedCategory, realStart, realPageSize);
    console.log(stations);
    setStations(stations);
  };

  useState(() => {
    const itemHeight = 60;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  useEffect(() => {
    loadStations()
  }, [selectedCategory, selectedPage]);

  return (
    <Container className="stationsContainer" fluid {...swipe} style={{ marginTop: topMargin(settings) }}>
      <Row>
        <Col lg="1" xl="1" md="1" sm="1">
          <RadioCategories category={selectedCategory} setCategory={setSelectedCategory} />
        </Col>
        <Col lg="11" xl="11" md="11" sm="11">
          {stations?.map(station => (
            <Item
              text={station.name}
              buttons={(
                <Button content="Play" onClick={() => {
                  setMediaType('stream');
                  play(station.url_resolved, preferences.vlcHost, preferences.vlcPort, preferences.vlcPassword);
                }} />
              )}
            />
          ))}
          <Paginator
            onPageChange={(page) => setSelectedPage(page)}
            selectedPage={selectedPage}
            disableRandom
          />
        </Col>
      </Row>
    </Container>
  );
}

export default RadioList;