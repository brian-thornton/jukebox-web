import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Button from '../Button';
import './InRowDeleteConfirmation.scss';

const propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

const InRowDeleteConfirmation = ({ intl, onCancel, onConfirm }) => (
  <>
    <div className="delete-confirm-are-you-sure">{intl.formatMessage({id: 'are_you_sure'})}</div>
    <Button onClick={onCancel} content={intl.formatMessage({id: 'cancel'})} />
    <Button onClick={onConfirm} content={intl.formatMessage({id: 'delete'})} />
  </>
);

InRowDeleteConfirmation.propTypes = propTypes;

export default injectIntl(InRowDeleteConfirmation);
