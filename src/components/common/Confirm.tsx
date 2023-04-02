import Card from 'react-bootstrap/Card';
import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import { SettingsContext } from '../layout/SettingsProvider';
import './Confirm.scss';

interface IConfirm {
  onConfirm: Function,
  onCancel: Function,
  text: string,
}

const Confirm: FC<IConfirm> = ({ onConfirm, onCancel, text }) => {
  const { styles, isScreenSmall } = useContext(SettingsContext);

  if (styles) {
    const { controlButtonSize, fontColor, trackBackgroundColor } = styles;
    const buttonSize = controlButtonSize === 'small' ? '' : '60';
    const fontSize = controlButtonSize === 'small' ? '' : '20px';
    const marginTop = isScreenSmall ? '60px' : '0px';

    return (
      <Card className="confirmCard" style={{ color: fontColor, marginTop }}>
        <Card.Body style={{ background: trackBackgroundColor }}>
          <Card.Title className="confirmTitle">
            <FormattedMessage id="are_you_sure" />
          </Card.Title>
          <Card.Text className="confirmText">{text}</Card.Text>
          <div className="confirmText">
            <Button
              height={buttonSize}
              width={buttonSize}
              style={{ fontSize }}
              onClick={onCancel}
              content={<FormattedMessage id="no" />}
            />
            <Button
              height={buttonSize}
              width={buttonSize}
              style={{ fontSize }}
              onClick={onConfirm}
              content={<FormattedMessage id="yes" />}
            />
          </div>
        </Card.Body>
      </Card>
    );
  }

  return <></>;
};

export default Confirm;
