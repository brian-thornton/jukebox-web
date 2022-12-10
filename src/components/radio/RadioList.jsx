import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';

import Button from '../Button';
import { getStations, play } from '../../lib/radio-client';
import RadioCategories from './RadioCategories';
import { SettingsContext } from '../layout/SettingsProvider';
import './RadioList.scss';
import { topMargin } from '../../lib/styleHelper';
import PaginatedList from '../common/PaginatedList';

const propTypes = {
  setMediaType: PropTypes.func.isRequired,
};

const RadioList = ({ setMediaType }) => {
  const settings = useContext(SettingsContext);
  const { preferences } = settings;
  const [selectedCategory, setSelectedCategory] = useState('rock');
  const [stations, setStations] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const isScreenSmall = window.innerWidth < 700;

  const loadStations = async () => {
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

    const data = await getStations(selectedCategory, realStart, realPageSize);
    setStations(data);
  };

  useState(() => {
    const itemHeight = isScreenSmall ? 45 : 60;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  useEffect(() => {
    loadStations();
  }, [selectedCategory, selectedPage]);

  const itemButtons = station => (
    <Button
      content="Play"
      onClick={() => {
        setMediaType('stream');
        play(station.url_resolved, preferences.vlcHost,
          preferences.vlcPort, preferences.vlcPassword);
      }}
    />
  );

  const items = () => stations?.map(station => (
    {
      text: station.name,
      buttons: itemButtons(station),
    }
  ));

  return (
    <Container className="stationsContainer" fluid style={{ marginTop: topMargin(settings) }}>
      <Row>
        <Col lg="1" xl="1" md="1" sm="1">
          <RadioCategories category={selectedCategory} setCategory={setSelectedCategory} />
        </Col>
        <Col lg="11" xl="11" md="11" sm="11">
          <PaginatedList
            items={items()}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        </Col>
      </Row>
    </Container>
  );
};

RadioList.propTypes = propTypes;

export default RadioList;
