import React, { useState } from "react";

import Button from "../Button";
import InRowDeleteConfirmation from "../common/InRowDeleteConfirmation";
import Item from "../common/Item";
import { deleteSkin } from '../../lib/style-client';

const SkinRow = ({ skin, reloadSkins, onCopy, setEditSkin, setSelectedSkin }) => {
  const [deleteConfirmSkin, setDeleteConfirmSkin] = useState();

  const removeSkin = (skin) => {
    deleteSkin(skin.name).then(() => {
      reloadSkins();
    });
  };

  return (
    <Item
      text={skin.name}
      buttons={(
        <>
          {deleteConfirmSkin?.name === skin.name && (
            <InRowDeleteConfirmation
              onCancel={() => setDeleteConfirmSkin(null)}
              onConfirm={() => {
                removeSkin(skin);
                setDeleteConfirmSkin(null);
              }}
            />
          )}
          {deleteConfirmSkin?.name !== skin.name && (
            <>
              <Button onClick={() => onCopy(skin)} content="Make a Copy" />
              <Button onClick={() => setEditSkin(skin)} content="Edit" disabled={!skin.isEditable} />
              <Button onClick={() => setSelectedSkin(skin)} content="Use Skin" />
              <Button onClick={() => setDeleteConfirmSkin(skin)} content="Delete" disabled={!skin.isEditable} />
            </>
          )}
        </>
      )}
    />
  )
}

export default SkinRow;