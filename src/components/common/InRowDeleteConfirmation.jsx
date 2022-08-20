import React from 'react';

import Button from '../Button';
import './InRowDeleteConfirmation.scss';

const InRowDeleteConfirmation = ({ onCancel, onConfirm }) => (
  <>
    <div className="delete-confirm-are-you-sure">Are you sure you want to delete? </div>
    <Button onClick={onCancel} content="Cancel" />
    <Button onClick={onConfirm} content="Delete" />
  </>
);

export default InRowDeleteConfirmation;