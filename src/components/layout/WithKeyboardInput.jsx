import { cloneDeep } from 'lodash';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { PropTypes } from 'prop-types';
import React from 'react';

const propTypes = {
  component: PropTypes.node.isRequired,
  debouncedSearch: PropTypes.func.isRequired,
  tempSearch: PropTypes.string.isRequired,
  setTempSearch: PropTypes.func.isRequired,
};

function WithKeyboardInput({
  component,
  tempSearch,
  setTempSearch,
  debouncedSearch,
}) {
  return (
    <>
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
    </>
  );
}

WithKeyboardInput.propTypes = propTypes;

export default WithKeyboardInput;
