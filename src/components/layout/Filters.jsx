import React, { useState, useEffect } from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import { getLibraries } from '../../lib/librarian-client';
import Item from '../common/Item';
import Loading from '../common/Loading';
import Paginator from '../common/Paginator';
import Button from '../Button';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function Filters({ setIsFilterOpen, setSelectedLibraries, selectedLibraries }) {
  const [filters, setFilters] = useState(selectedLibraries);
  const [libraries, setLibraries] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
        <Container fluid style={{ marginTop: '60px ' }}>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{libraries.slice(realStart, (realStart + realPageSize)).map((library) => {
                const checked = selectedLibraries.find((lib) => lib.path === library.path);
                
                return (
                  <Item
                    checked={checked}
                    includeCheckbox
                    onCheck={() => {
                      setFilters(checked ? filters.filter(f => f.path !== library.path) : oldArray => [...oldArray, library]);
                    }}
                    text={`${library.path} - Tracks: ${library.totalTracks || 0}`}
                  />
                )
              })}</Row>
            </Col>
          </Row>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Paginator
                disableRandom
                onPageChange={(page) => setSelectedPage(page)}
                style={{ marginTop: '100px' }}
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
                  setIsFilterOpen(false);
                }}
              />
              <Button
                content="Apply Filters"
                onClick={() => {
                  setSelectedLibraries(filters);
                  setIsFilterOpen(false);
                }}
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

Filters.propTypes = propTypes;

export default Filters;