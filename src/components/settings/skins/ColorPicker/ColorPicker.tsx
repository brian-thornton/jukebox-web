import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { FC, useEffect, useState, useContext } from 'react';
// @ts-ignore
import { ChromePicker } from 'react-color';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { FormattedMessage } from 'react-intl';

import Button from '../../../common/Buttons/Button/Button';
import { SettingsContext } from '../../../layout/SettingsProvider';
import styles from './ColorPicker.module.css';

interface IColorPicker {
  onChange: Function,
  setIsOpen: Function,
  setColor: Function,
  solidOnly: boolean,
}

interface ISolidColor {
  hex: string,
}

interface IGradientColor {
  rgb: {
    r: number,
    g: number,
    b: number,
  },
}

const ColorPicker: FC<IColorPicker> = ({
  setIsOpen,
  setColor,
  onChange,
  solidOnly,
}) => {
  const settings = useContext(SettingsContext);
  const [opacity, setOpacity] = useState(4);
  const [colorType, setColorType] = useState<string | null>('solid');
  const [gradientA, setGradientA] = useState<IGradientColor | undefined>(undefined);
  const [gradientB, setGradientB] = useState<IGradientColor | undefined>(undefined);
  const [colorString, setColorString] = useState('transparent');
  const [solidColor, setSolidColor] = useState<ISolidColor | undefined>(undefined);

  const picker = (color: ISolidColor | IGradientColor | undefined, width: string, handler: Function) => (
    <div style={{ width, display: 'inline-block' }}>
      <ChromePicker color={color} onChangeComplete={handler} />
    </div>
  );

  const formatColor = () => {
    if (colorType === 'transparent') {
      setColor('transparent');
      setColorString('transparent');
    } else if (colorType === 'solid') {
      if (solidColor && solidColor.hex) {
        setColor(solidColor.hex);
        setColorString(solidColor.hex);
      }
    } else if (gradientA && gradientA.rgb && gradientB && gradientB.rgb) {
      const gradientString = `linear-gradient(180deg, rgba(${gradientA.rgb.r},${gradientA.rgb.g},${gradientA.rgb.b}, .${opacity}) 0%, rgba(${gradientB.rgb.r},${gradientB.rgb.g},${gradientB.rgb.b}, .${opacity}) 100%`;
      setColor(gradientString);
      setColorString(gradientString);
    }
  };

  useEffect(formatColor, [gradientA, gradientB, opacity]);

  const transparentCardSkin = {
    color: settings?.styles?.fontColor,
  };

  const formLabelStyle = {
    color: settings?.styles?.fontColor,
  };

  const SolidColorTabBody = () => (
    <div className={styles.solidRow}>
      {picker(solidColor, '50%', (colorData: ISolidColor) => {
        setSolidColor(colorData)
        formatColor();
      })}
      <div style={{ backgroundColor: colorString, width: '40%', height: '20vh' }}><FormattedMessage id="example" /></div>
    </div>
  );

  const GradientTabBody = () => (
    <div className={styles.solidRow}>
      {picker(gradientA, '50%', (colorData: IGradientColor) => setGradientA(colorData))}
      {picker(gradientB, '50%', (colorData: IGradientColor) => setGradientB(colorData))}
      <div style={{ background: colorString, height: '40vh', width: '100%' }}><FormattedMessage id="example" /></div>
      <Form.Label className={styles.formLabel} style={formLabelStyle}>
        <FormattedMessage id="opacity" />
      </Form.Label>
      <Form.Range onChange={e => setOpacity(parseInt(e.target.value))} />
    </div>
  );

  const TransparentTabBody = () => (
    <Card className={styles.transparentCardStyle} style={transparentCardSkin}>
      <Card.Title className={styles.colorPickerTitle}><FormattedMessage id="transparent_title" /></Card.Title>
      <Card.Body>
        <Card.Text className={styles.colorPickerText}>
          <FormattedMessage id="transparent_text" />
        </Card.Text>
      </Card.Body>
    </Card>
  );

  return (
    <>
      {!solidOnly && (
        <Card className={styles.transparentCardStyle}>
          <Card.Body>
            <Tabs onSelect={e => setColorType(e)}>
              <Tab eventKey="solid" title="Solid Color">
                <SolidColorTabBody />
              </Tab>
              <Tab eventKey="gradient" title="Gradient">
                <GradientTabBody />
              </Tab>
              <Tab eventKey="transparent" title="Transparent">
                <TransparentTabBody />
              </Tab>
            </Tabs>
            <Button
              onClick={() => setIsOpen(false)}
              content={<FormattedMessage id="cancel" />}
            />
            <Button
              onClick={() => {
                formatColor();
                setIsOpen(false);
              }}
              content={<FormattedMessage id="save" />}
            />
          </Card.Body>
        </Card>
      )}
      {solidOnly && picker(solidColor, '100%', (colorData: ISolidColor) => setSolidColor(colorData))}
    </>
  );
};

export default ColorPicker;
