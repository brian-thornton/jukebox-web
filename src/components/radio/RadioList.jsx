import Container from 'react-bootstrap/Container';
import { PropTypes } from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { PlayFill } from 'react-bootstrap-icons';

import Button from '../Button';
import { getStations, play } from '../../lib/radio-client';
import RadioCategories from './RadioCategories';
import { SettingsContext } from '../layout/SettingsProvider';
import './RadioList.scss';
import { headerFooterReserve, topMargin } from '../../lib/styleHelper';
import PaginatedList from '../common/PaginatedList';

const propTypes = {
  setMediaType: PropTypes.func.isRequired,
};

const RadioList = ({ setMediaType }) => {
  const settings = useContext(SettingsContext);
  const { isScreenSmall, preferences } = settings;
  const { controlButtonSize } = settings.styles;
  const [selectedCategory, setSelectedCategory] = useState('rock');
  const [stations, setStations] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const heightAndWidth = ['large', 'medium'].includes(controlButtonSize) ? '60' : '';
  const fontSize = ['large', 'medium'].includes(controlButtonSize) ? '30px' : '';

  const loadStations = async () => {
    const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
    const data = await getStations(selectedCategory, realStart, realPageSize);
    setStations(data);
  };

  useState(() => {
    const reserve = headerFooterReserve(settings);
    const height = ['large', 'medium'].includes(controlButtonSize) ? 70 : 60
    const itemHeight = height;
    const viewPortHeight = Math.floor(window.innerHeight - reserve);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));
  }, []);

  useEffect(() => {
    loadStations();
  }, [selectedCategory, selectedPage]);

  const itemButtons = station => (
    <Button
      height={heightAndWidth}
      width={heightAndWidth}
      content={<PlayFill />}
      style={{fontSize }}
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
