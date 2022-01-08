import React, { useContext, useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';

import Button from '../Button';
import Item from '../common/Item';
import PagedContainer from '../common/PagedContainer';
import {
  getHeight,
  initListPaging,
  nextPage,
  previousPage,
} from '../../lib/pageHelper';
import { updateSettings } from '../../lib/settings-client';
import { SettingsContext } from '../layout/SettingsProvider';

function SettingsEditor() {
  const [features, setFeatures] = useState();
  const settings = useContext(SettingsContext);
  const [paging, setPaging] = useState();
  const initialHeight = getHeight();

  const updateFeature = (name, value) => {
    const deepClone = JSON.parse(JSON.stringify(settings));
    deepClone.features[name] = value;
    updateSettings(deepClone).then(() => {
      window.location.reload();
    });
  };

  const loadSettings = () => {
    const data = Object.keys(settings.features);
    setFeatures(data);
    setPaging(initListPaging(data.length, 90, initialHeight));
  }

  useEffect(loadSettings, []);

  const settingRow = (name, value) => {
    const buttonText = value ? 'Enabled' : 'Disabled';

    return (
      <Item
        buttons={(
          <Button
            onClick={() => updateFeature(name, !value)}
            isToggle
            isToggled={value}
            content={buttonText}
          />
        )}
        text={name}
      />
    );
  };

  const content = () => {
    return features.slice(paging.currentPage.start, paging.currentPage.limit).map(key => settingRow(key, settings.features[key]));
  };

  if (paging && features) {
    return (
      <PagedContainer
        paging={paging}
        content={<ListGroup style={{width: '100%'}}>{content()}</ListGroup>}
        clientNextPage={() => setPaging(nextPage(paging))}
        clientPreviousPage={() => setPaging(previousPage(paging))}
      />
    );
  }

  return <></>;

}
export default SettingsEditor;
