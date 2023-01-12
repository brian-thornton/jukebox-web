import { PlusSquare } from 'react-bootstrap-icons';
import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { v4 as uuidv4 } from 'uuid';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import AddNew from '../common/AddNew';
import { updateSettings } from '../../lib/settings-client';
import './Segments.scss';
import { createSegment, removeSegment } from '../../lib/lighting-client';
import SegmentRowEdit from './SegmentRowEdit';
import SegmentRowInfo from './SegmentRowInfo';
import { Event, LightingController, Segments as SegmentsShape, Skin } from '../shapes';
import FullWidthRow from '../common/FullWidthRow';

const propTypes = {
  controller: LightingController.isRequired,
  segments: SegmentsShape.isRequired,
  allowAdd: PropTypes.bool,
  onConfigure: PropTypes.func.isRequired,
  skin: Skin,
  event: Event.isRequired,
};

export const Segments = ({
  intl,
  controller,
  segments,
  allowAdd,
  onConfigure,
  skin,
  event,
}) => {
  const settings = useContext(SettingsContext);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [segment, setSegment] = useState();
  const [configureSegment, setConfigureSegment] = useState();

  const isSegmentOnController = (start, stop) => (
    segments.filter(s => s.start.toString() === start.toString()
      && s.stop.toString() === stop.toString()).length >= 1
  );

  const onUpdateSegment = async (oldData, data) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    const updatedController = deepClone.controllers?.find(c => c.ip === controller.info.ip);

    if (!updatedController?.segments?.length) {
      // No segments exist for the controller. Add the first one.
      updatedController.segments = [{
        id: uuidv4(),
        start: data.start,
        stop: data.stop,
        name: data.name,
      }];
    } else {
      // Check if we are updating an existing segment.
      const updatedSegment = updatedController.segments.find(s => s.id === data.id);

      if (updatedSegment) {
        // An existing segment was found. Update it.
        updatedSegment.name = data.name.toString();
        updatedSegment.start = data.start.toString();
        updatedSegment.stop = data.stop.toString();
      } else {
        // The controller exists and has segments but we need to add one.
        updatedController.segments.push({
          id: uuidv4(),
          start: data.start,
          stop: data.stop,
          name: data.name,
        });
      }
    }

    // Check if the segment is on the controller. If it is we need to
    // push out the update.
    if (oldData) {
      if (isSegmentOnController(oldData.start, oldData.stop)) {
        await removeSegment(controller.info.ip, oldData.start, oldData.stop);
        await createSegment(controller.info.ip, data.start, data.stop);
      }
    }

    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const segmentRow = (seg, isOnController) => {
    const segmentInConfigurationMode = configureSegment && seg.id === configureSegment.id
      && seg.start === configureSegment.start && seg.stop === configureSegment.stop;

    return (
      <>
        {!segmentInConfigurationMode && (
          <SegmentRowInfo
            isOnController={isOnController}
            onConfigure={(s) => {
              setConfigureSegment(s);

              // If we have an onConfigure function we are configuring skin colors.
              // If not, we are setting up cabinet segments.
              if (onConfigure) {
                onConfigure(s);
              }
            }}
            event={event}
            segment={seg}
            skin={skin}
            controller={controller}
          />
        )}
        {segmentInConfigurationMode && !skin && (
          <SegmentRowEdit
            onSave={onUpdateSegment}
            onCancel={() => setConfigureSegment(null)}
            setSegment={setSegment}
            event={event}
            segment={seg}
            skin={skin}
            controller={controller}
          />
        )}
      </>
    );
  };

  const onAddSegment = fields => onUpdateSegment(null, fields);
  const displayRow = () => (
    !settings.controllers?.find(c => (
      c.ip === (controller.info?.ip || controller.ip)).segments.find(s => (
        s.start.toString() === segment.start.toString()
        && s.stop.toString() === segment.stop.toString())))
  );

  return (
    <>
      {isAddOpen && (
        <AddNew
          title={<FormattedMessage id="add_new_lighting_segment" />}
          onConfirm={(fields) => {
            onAddSegment(fields);
          }}
          onCancel={() => setIsAddOpen(false)}
          fields={{
            name: <FormattedMessage id="name" />,
            start: <FormattedMessage id="starting_led_position" />,
            stop: <FormattedMessage id="ending_led_position" />,
          }}
        />
      )}
      {!isAddOpen && (
        <Container fluid className="styleEditorContent">
          {allowAdd && (
            <Row>
              <Button
                onClick={() => {
                  setIsAddOpen(true);
                }}
                icon={<PlusSquare />}
              />
            </Row>
          )}
          <FullWidthRow>
            <ListGroup className="styleEditorContent">
              {settings.controllers?.find(c => (
                c.ip === (controller.info?.ip || controller.ip)).segments.map(s => (
                  segmentRow(s, isSegmentOnController(s.start, s.stop)))))
              }
              {segments?.map((s) => {
                if (displayRow()) {
                  segmentRow(s, true);
                }

                return <></>;
              })}
            </ListGroup>
          </FullWidthRow>
        </Container>
      )}
    </>
  );
};

Segments.defaultProps = {
  allowAdd: true,
  skin: null,
};

Segments.propTypes = propTypes;

export default Segments;
