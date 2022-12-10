import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import { getLibraries } from '../../lib/librarian-client';
import Item from '../common/Item';
import Loading from '../common/Loading';
import Paginator from '../common/Paginator';
import Button from '../Button';
import './Filters.scss';
import { handlers } from '../../lib/gesture-helper';
import { Libraries } from '../shapes';

const propTypes = {
  selectedLibraries: Libraries.isRequired,
  setSelectedLibraries: PropTypes.func.isRequired,
};

const Filters = ({ selectedLibraries, setSelectedLibraries }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(selectedLibraries);
  const [libraries, setLibraries] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  const loadLibraries = async () => {
    const libs = await getLibraries();
    setLibraries(libs);
    setIsLoading(false);
  };

  const loadFilters = () => {
    loadLibraries();
  };

  useEffect(() => {
    const itemHeight = 70;
    const viewPortHeight = Math.floor(window.innerHeight - 200);
    setRealPageSize(Math.floor(viewPortHeight / itemHeight));

    setIsLoading(true);
    loadFilters();
  }, []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);
  useEffect(() => setSelectedLibraries(filters), [filters]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && libraries.length && (
        <Container {...swipe} fluid className="filter-container">
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row className="filterRow">
                {libraries.slice(realStart, (realStart + realPageSize)).map((library) => {
                  const checked = selectedLibraries.find(lib => lib.path === library.path);

                  return (
                    <Item
                      checked={checked}
                      includeCheckbox
                      onCheck={() => {
                        setFilters(checked ? filters.filter(f => f.path !== library.path)
                          : oldArray => [...oldArray, library]);
                      }}
                      text={`${library.path} - Tracks: ${library.totalTracks || 0}`}
                    />
                  );
                })}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Paginator
                disableRandom
                onPageChange={page => setSelectedPage(page)}
                selectedPage={selectedPage}
                totalItems={libraries.length}
                pageSize={realPageSize}
              />
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Button
                content="Clear Filters"
                onClick={() => {
                  setSelectedLibraries([]);
                  navigate('/albums');
                }}
              />
              <Button
                content="Apply Filters"
                onClick={() => {
                  setSelectedLibraries(filters);
                  navigate('/albums');
                }}
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

Filters.propTypes = propTypes;

export default Filters;
