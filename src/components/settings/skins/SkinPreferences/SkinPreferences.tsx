import { FormattedMessage, useIntl } from 'react-intl';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FC, useContext, useState } from 'react';
import Row from 'react-bootstrap/Row';

import { deleteSkin, createSkin } from '../../../../lib/service-clients/style-client';
import { SettingsContext } from '../../../layout/SettingsProvider';
import Button from '../../../Button';
import NameInput from '../../../common/NameInput/NameInput';
import { ISkin } from '../../../interface';

import ToggleRow from '../../ToggleRow';
import classes from './SkinPreferences.module.css';

interface ISkinPreferences {
  skin: ISkin,
  onClose: Function,
}

const SkinPreferences: FC<ISkinPreferences> = ({ skin, onClose }) => {
  const intl = useIntl();
  const [navButtonType, setNavButtonType] = useState(skin.navButtonType || 'buttons');
  const [navButtonSize, setNavButtonSize] = useState(skin.navButtonSize || 'small');
  const [buttonShape, setButtonShape] = useState(skin.buttonShape || 'rectangle');
  const [controlButtonSize, setControlButtonSize] = useState(skin.controlButtonSize || 'small');
  const [controlUseBackground, setControlUseBackground] = useState(skin.controlUseBackground || false);
  const [updatedName, setUpdatedName] = useState();
  const settings = useContext(SettingsContext);
  const { styles } = settings;
  const { trackBackgroundColor, fontColor } = styles || {}

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
        <Card className={classes.skinDetailCard} style={{ background: trackBackgroundColor }}>
          <Card.Title className={classes.skinDetailCardTitle} style={{ color: fontColor }}>
            <Container fluid className="skin-detail-card-container" style={{ background: trackBackgroundColor }}>
              <Row className={classes.skinNameRow}>
                <Col lg="2" md="2" sm="2">
                  <div className={classes.skinNameLabel}><FormattedMessage id="skin_name" /></div>
                </Col>
                <Col lg="9" md="9" sm="9">
                  <NameInput
                    disabled={!skin.isEditable}
                    defaultValue={skin.name}
                    onChange={(e: any) => setUpdatedName(e.target.value)}
                  />
                </Col>
                <Col lg="1" md="1" sm="1">
                  <Button
                    content={<FormattedMessage id="save" />}
                    onClick={() => saveSkin(updatedName)}
                    disabled={!skin.isEditable}
                  />
                </Col>
              </Row>
              <ToggleRow
                description={intl.formatMessage({ id: 'button_shape' })}
                keys={['rectangle', 'round']}
                selectedKey={buttonShape}
                onSetKey={(value: any) => setButtonShape(value)}
              />
              <ToggleRow
                description={intl.formatMessage({id: 'navigation_link_style'})}
                keys={['links', 'buttons']}
                selectedKey={navButtonType}
                onSetKey={(value: any) => setNavButtonType(value)}
              />
              <ToggleRow
                description={intl.formatMessage({id: 'navigation_button_size'})}
                keys={['small', 'medium', 'large']}
                selectedKey={navButtonSize}
                onSetKey={(value: any) => setNavButtonSize(value)}
              />
              <ToggleRow
                description={intl.formatMessage({id: 'control_button_size'})}
                keys={['small', 'medium', 'large']}
                selectedKey={controlButtonSize}
                onSetKey={(value: any) => setControlButtonSize(value)}
              />
              <ToggleRow
                description={intl.formatMessage({id: 'use_background'})}
                keys={['on', 'off']}
                // @ts-ignore
                selectedKey={controlUseBackground}
                onSetKey={(value: any) => setControlUseBackground(value)}
              />
            </Container>
          </Card.Title>
        </Card>
      </Row>
    </Container>
  );
};

export default SkinPreferences;
