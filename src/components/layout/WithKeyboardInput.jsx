import React from 'react';
import { cloneDeep } from 'lodash';
import KeyboardEventHandler from 'react-keyboard-event-handler';

function WithKeyboardInput({
  component,
  tempSearch,
  setTempSearch,
  debouncedSearch,
}) {
  return (
    <React.Fragment>
      <KeyboardEventHandler
        handleKeys={['alphanumeric', 'space', 'backspace']}
        onKeyEvent={(key) => {
          let newSearch = cloneDeep(tempSearch);
          if (key === 'space') {
            newSearch = `${tempSearch} `;
            setTempSearch(`${tempSearch} `);
          } else if (key === 'backspace') {
            newSearch = `${tempSearch.substring(0, tempSearch.length - 1)}`;
            setTempSearch(`${tempSearch.substring(0, tempSearch.length - 1)}`);
          } else {
            newSearch = `${tempSearch}${key}`;
            setTempSearch(`${tempSearch}${key}`);
          }

          debouncedSearch(newSearch);
        }}
      />
      {component}
    </React.Fragment>
  );
}

export default WithKeyboardInput;
