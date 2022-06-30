import React from 'react';

import Button from '../Button';

const InRowDeleteConfirmation = ({ onCancel, onConfirm }) => (
  <>
    <div style={{marginTop: '10px', marginRight: '10px', float: 'left'}}>Are you sure you want to delete? </div>
    <Button onClick={onCancel} content="Cancel" />
    <Button onClick={onConfirm} content="Delete" />
  </>
);

export default InRowDeleteConfirmation;