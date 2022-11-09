import React from "react";

import Button from "../../Button";
import Item from "../../common/Item";

const SkinRow = ({ skin, setEditSkin, setSelectedSkin }) => {
  return (
    <Item
      text={skin.name}
      buttons={(
        <>
          <Button onClick={() => setEditSkin(skin)} content="Edit" />
          <Button onClick={() => setSelectedSkin(skin)} content="Use Skin" />
        </>
      )}
    />
  )
}

export default SkinRow;