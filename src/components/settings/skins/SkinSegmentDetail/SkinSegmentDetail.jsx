import { PropTypes } from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../common/Buttons/Button/Button';
import { getCurrentState } from '../../../../lib/service-clients/lighting-client';
import { Segments } from '../../Segments';
import SegmentColorSelection from '../../SegmentColorSelection';
import './SkinSegmentDetail.scss';
import { SettingsContext } from '../../../layout/SettingsProvider';
import { Controller, Event, Skin } from '../../../shapes';

const propTypes = {
  controller: Controller.isRequired,
  skin: Skin.isRequired,
  onCancel: PropTypes.func.isRequired,
  event: Event.isRequired,
};

const SkinSegmentDetail = ({
  controller,
  skin,
  event,
  onCancel,
}) => {
  const [controllerState, setControllerState] = useState();
  const [configSegment, setConfigSegment] = useState();
  const settings = useContext(SettingsContext);

  const loadState = async () => {
    getCurrentState(controller.ip).then(data => setControllerState(data));
  };

  const initState = () => loadState();

  useEffect(() => {
    if (!controllerState) {
      initState();
    }
  }, []);

  return (
    <>
      {!configSegment && controllerState && controllerState.state && (
        <Segments
          skin={skin}
          event={event}
          controller={controller}
          segments={controllerState.state.seg}
          allowAdd={false}
          allowRemove={false}
          onConfigure={segment => setConfigSegment(segment)}
        />
      )}
      <div style={{ color: settings.styles.fontColor }}>
        <FormattedMessage
          id="skin_lighting_for_controller"
          values={{
            ip: controller.ip,
            segment: configSegment.id,
            event,
          }}
        />
      </div>
      {configSegment && (
        <SegmentColorSelection
          event={event}
          controller={controller}
          skin={skin}
          segment={configSegment}
          onSaveComplete={() => setConfigSegment(null)}
        />
      )}
      <Button
        className="skin-segment-detail-done-button"
        onClick={() => onCancel(null)}
        content={<FormattedMessage id="done" />}
      />
    </>
  );
};

SkinSegmentDetail.propTypes = propTypes;

export default SkinSegmentDetail;
