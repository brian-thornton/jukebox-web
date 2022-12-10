import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import './InRowDeleteConfirmation.scss';

const propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

const InRowDeleteConfirmation = ({ onCancel, onConfirm }) => (
  <>
    <div className="delete-confirm-are-you-sure">Are you sure you want to delete? </div>
    <Button onClick={onCancel} content="Cancel" />
    <Button onClick={onConfirm} content="Delete" />
  </>
);

InRowDeleteConfirmation.propTypes = propTypes;

export default InRowDeleteConfirmation;
