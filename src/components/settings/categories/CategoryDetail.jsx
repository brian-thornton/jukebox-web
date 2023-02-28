import React, { useEffect, useState } from 'react';

import NameInput from '../../common/NameInput';
import Button from '../../Button';

const CategoryDetail = ({ category, setCategory, onClose }) => {
  const [updatedCategory, setUpdatedCategory] = useState({ name: category });

  useEffect(() => console.log(updatedCategory), [updatedCategory]);

  const saveCategory = () => {

  };

  return (
    <>
      <NameInput
        defaultValue={category}
        onChange={(e) => setUpdatedCategory({ ...updatedCategory, name: e.target.value })}
      />
      <Button content="Save" onClick={onClose} />
      <Button content="Cancel" onClick={onClose} />
    </>
  )
};

export default CategoryDetail;