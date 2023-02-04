import { FormattedMessage } from 'react-intl';
import { PropTypes } from 'prop-types';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React, { useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';

import { deleteSkin, createSkin } from '../../../lib/style-client';
import { SettingsContext } from '../../layout/SettingsProvider';
import { Skin } from '../../shapes';
import Button from '../../Button';
import NameInput from '../../common/NameInput';

import './SkinPreferences.scss';
import ToggleRow from '../ToggleRow';

const propTypes = {
  onClose: PropTypes.func.isRequired,
  skin: Skin.isRequired,
};

const SkinPreferences = ({ skin, onClose }) => {
  const [navButtonType, setNavButtonType] = useState(skin.navButtonType || 'buttons');
  const [navButtonSize, setNavButtonSize] = useState(skin.navButtonSize || 'small');
  const [buttonShape, setButtonShape] = useState(skin.buttonShape || 'rectangle');
  const [controlButtonSize, setControlButtonSize] = useState(skin.controlButtonSize || 'small');
  const [controlUseBackground, setControlUseBackground] = useState(skin.controlUseBackground || false);
  const [updatedName, setUpdatedName] = useState();
  const settings = useContext(SettingsContext);

  const saveSkin = (newName = skin.name) => {
    deleteSkin(skin.name).then(() => {
      const { name, ...colors } = skin;

      const updatedSkin = {
        name: newName,
        skin: {
          ...colors,
          name: newName,
          navButtonType,
          navButtonSize,
          controlButtonSize,
          buttonShape,
          controlUseBackground,
        },
      };

      createSkin(updatedSkin).then(() => { });
    });
  };

  return (
    <Container fluid>
      <Row>
        <Button content={<FormattedMessage id="back_to_skin" />} onClick={onClose} />
      </Row>
      <Row>
        <Card className="skin-detail-card" style={{ background: settings.styles.trackBackgroundColor }}>
          <Card.Title className="skin-detail-card-title" style={{ color: settings.styles.fontColor }}>
            <Container fluid className="skin-detail-card-container" style={{ background: settings.styles.trackBackgroundColor }}>
              <Row className="skin-name-row">
                <Col lg="2" md="2" sm="2">
                  <div className="skin-name-label"><FormattedMessage id="skin_name" /></div>
                </Col>
                <Col lg="9" md="9" sm="9">
                  <NameInput
                    disabled={!skin.isEditable}
                    defaultValue={skin.name}
                    onChange={e => setUpdatedName(e.target.value)}
                  />
                </Col>
                <Col lg="1" md="1" sm="1">
                  <Button
                    className="skin-detail-save"
                    content={<FormattedMessage id="save" />}
                    onClick={() => saveSkin(updatedName)}
                    disabled={!skin.isEditable}
                  />
                </Col>
              </Row>
              <ToggleRow
                description={<FormattedMessage id="button_shape" />}
                keys={['rectangle', 'round']}
                selectedKey={buttonShape}
                onSetKey={value => setButtonShape(value)}
              />
              <ToggleRow
                description={<FormattedMessage id="navigation_link_style" />}
                keys={['links', 'buttons']}
                selectedKey={navButtonType}
                onSetKey={value => setNavButtonType(value)}
              />
              <ToggleRow
                description={<FormattedMessage id="navigation_button_size" />}
                keys={['small', 'medium', 'large']}
                selectedKey={navButtonSize}
                onSetKey={value => setNavButtonSize(value)}
              />
              <ToggleRow
                description={<FormattedMessage id="control_button_size" />}
                keys={['small', 'medium', 'large']}
                selectedKey={controlButtonSize}
                onSetKey={value => setControlButtonSize(value)}
              />
              <ToggleRow
                description={<FormattedMessage id="use_background" />}
                keys={['on', 'off']}
                selectedKey={controlUseBackground}
                onSetKey={value => setControlUseBackground(value)}
              />
            </Container>
          </Card.Title>
        </Card>
      </Row>
    </Container>
  );
};

SkinPreferences.propTypes = propTypes;

export default SkinPreferences;
