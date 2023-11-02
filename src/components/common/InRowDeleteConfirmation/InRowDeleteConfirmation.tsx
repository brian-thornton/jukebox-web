import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../Button';
import styles from './InRowDeleteConfirmation.module.css';

interface IInRowDeleteConfirmation {
  onCancel: Function,
  onConfirm: Function,
}

const InRowDeleteConfirmation: FC<IInRowDeleteConfirmation> = ({ onCancel, onConfirm }) => (
  <>
    <div className={styles.deleteConfirmAreYouSure}><FormattedMessage id="are_you_sure" /></div>
    <Button onClick={onCancel} content={<FormattedMessage id="cancel" />} />
    <Button onClick={onConfirm} content={<FormattedMessage id="delete" />} />
  </>
);

export default InRowDeleteConfirmation;
