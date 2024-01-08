import Card from 'react-bootstrap/Card';
import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../Button/Button';
import { SettingsContext } from '../../layout/SettingsProvider';
import classes from './Confirm.module.css';

interface IConfirm {
  onConfirm: Function,
  onCancel: Function,
  text: string,
}

const Confirm: FC<IConfirm> = ({ onConfirm, onCancel, text }) => {
  const { styles, isScreenSmall } = useContext(SettingsContext);

  if (styles) {
    const { fontColor, trackBackgroundColor } = styles;
    const marginTop = isScreenSmall ? '60px' : '0px';

    const button = (content: any, onClick: any) => (
      <Button
        onClick={onClick}
        content={content}
      />
    );

    return (
      <Card className={classes.confirmCard} style={{ color: fontColor, marginTop }}>
        <Card.Body style={{ background: trackBackgroundColor }}>
          <Card.Title className={classes.confirmTitle}>
            <FormattedMessage id="are_you_sure" />
          </Card.Title>
          <Card.Text className={classes.confirmText}>{text}</Card.Text>
          <div className={classes.confirmText}>
            {button(<FormattedMessage id="no" />, onCancel)}
            {button(<FormattedMessage id="yes" />, onConfirm)}
          </div>
        </Card.Body>
      </Card>
    );
  }

  return <></>;
};

export default Confirm;
