import { FC, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../Buttons/Button/Button';
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
    const { fontColor } = styles;
    const marginTop = isScreenSmall ? '60px' : '0px';

    const button = (content: any, onClick: any) => (
      <Button
        onClick={onClick}
        content={content}
      />
    );

    return (
      <div className={classes.confirmCard} style={{ color: fontColor, marginTop }}>
        <h3 className={classes.confirmText}>{text}</h3>
        <div className={classes.confirmText}>
          {button(<FormattedMessage id="no" />, onCancel)}
          {button(<FormattedMessage id="yes" />, onConfirm)}
        </div>
      </div>
    );
  }

  return <></>;
};

export default Confirm;
