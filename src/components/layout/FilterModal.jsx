import React, { useState, useEffect } from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

import { getLibraries } from '../../lib/librarian-client';
import Item from '../common/Item';
import Modal from '../common/Modal';
import Paginator from '../common/Paginator';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function FilterModal({ isOpen, handleClose, setSelectedLibraries, selectedLibraries }) {
  const [filters, setFilters] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();

  const loadLibraries = async () => {
    const libs = await getLibraries();
    setLibraries(libs);
  };

  const loadFilters = () => {
    loadLibraries();
  };

  useEffect(() => {
    setRealPageSize(10);
    loadFilters();
  }, []);

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  useEffect(() => setSelectedLibraries(filters), [filters])

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      cancelText="Clear Filters"
      onCancel={() => {
        setSelectedLibraries([]);
        handleClose();
      }}
      confirmText={"Apply Filters"}
      onConfirm={() => {
        setSelectedLibraries(filters);
        handleClose();
      }}
      title="Filters"
      body={(
        <Container fluid>
          <Row>
            <Col lg="12" xl="12" md="12" sm="12">
              <Row>{libraries.slice(realStart, (realStart + realPageSize)).map((library) => (
                <Item
                  checked={selectedLibraries.includes(library)}
                  includeCheckbox
                  onCheck={() => {
                    if (filters.includes(library)) {
                      setFilters(filters.filter(lib => lib.path !== library.path))
                    } else {
                      setFilters(oldArray => [...oldArray, library]);
                    }
                  }}
                  text={`${library.path} - Tracks: ${library.totalTracks || 0}`}
                />
              ))}</Row>
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
        </Container>
      )}
    />
  );
}

FilterModal.propTypes = propTypes;

export default FilterModal;
