import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import './InRowDeleteConfirmation.scss';

const propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

const InRowDeleteConfirmation = ({ onCancel, onConfirm }) => (
  <>
    <div className="delete-confirm-are-you-sure"><FormattedMessage id="are_you_sure" /></div>
    <Button onClick={onCancel} content={<FormattedMessage id="cancel" />} />
    <Button onClick={onConfirm} content={<FormattedMessage id="delete" />} />
  </>
);

InRowDeleteConfirmation.propTypes = propTypes;

export default InRowDeleteConfirmation;
