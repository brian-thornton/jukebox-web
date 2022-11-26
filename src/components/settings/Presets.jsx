import React, { useEffect, useState } from "react";

import { Container, Row } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';

import Button from "../Button";
import Paginator from '../common/Paginator';
import { useSwipeable } from 'react-swipeable';
import { handlers } from '../../lib/gesture-helper';
import { pageSize } from '../../lib/styleHelper';
import Item from "../common/Item";

import { applyPreset, getPresets } from "../../lib/lighting-client";

const Presets = ({ controller, onClose }) => {
  const [presets, setPresets] = useState();
  const [selectedPage, setSelectedPage] = useState(1);
  const [realPageSize, setRealPageSize] = useState();
  const swipe = useSwipeable(handlers(setSelectedPage, selectedPage));

  const loadPresets = () => {
    setRealPageSize(pageSize('item', 300));
    getPresets(controller.ip).then((data) => {
      setPresets(Object.keys(data).map((key) => data[key]).filter((p) => p.n));
    });
  };

  const realStart = selectedPage === 1 ? 0 : ((selectedPage * realPageSize) - realPageSize);

  useEffect(loadPresets, []);

  return (
    <>
      <Button content="Back to Controllers" onClick={onClose} />
      {presets?.length > 0 && (
        <Container fluid>
          <Row>
            <ListGroup {...swipe} style={{ width: '100%' }}>
              {presets.slice(realStart, (realStart + realPageSize)).map((preset) => (
                <Item
                  text={preset.n}
                  buttons={(
                    <>
                      <Button
                        onClick={() => applyPreset(controller.ip, preset.n)}
                        content="Enable"
                      />
                    </>
                  )}
                />
              )
              )}
            </ListGroup>
          </Row>
          <Row>
            <Paginator
              disableRandom
              onPageChange={(page) => setSelectedPage(page)}
              selectedPage={selectedPage}
              totalItems={presets.length}
              pageSize={realPageSize}
            />
          </Row>
        </Container>
      )}
    </>
  )
};

export default Presets;