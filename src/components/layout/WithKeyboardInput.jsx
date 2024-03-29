import { cloneDeep } from 'lodash';
// import KeyboardEventHandler from 'react-keyboard-event-handler';
import { PropTypes } from 'prop-types';
import React from 'react';

const propTypes = {
  component: PropTypes.node.isRequired,
  debouncedSearch: PropTypes.func.isRequired,
  tempSearch: PropTypes.string.isRequired,
  setTempSearch: PropTypes.func.isRequired,
  setIsSearchOpen: PropTypes.func.isRequired,
};

const WithKeyboardInput = ({
  component,
  tempSearch,
  setTempSearch,
  debouncedSearch,
  setIsSearchOpen,
}) => {
  function handlePaste(e) {
    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');

    // Do whatever with pasteddata
    debouncedSearch(pastedData);
  }

  document.addEventListener('paste', handlePaste);

  return (
    <>
      {/* <KeyboardEventHandler
        handleKeys={['alphanumeric', 'space', 'backspace', 'cmd+v', '-', '.', 'cmd+f']}
        onKeyEvent={(key, e) => {
          let newSearch = cloneDeep(tempSearch);
          if (key === 'space') {
            newSearch = `${tempSearch} `;
            setTempSearch(`${tempSearch} `);
          } else if (key === 'backspace') {
            newSearch = `${tempSearch.substring(0, tempSearch.length - 1)}`;
            setTempSearch(`${tempSearch.substring(0, tempSearch.length - 1)}`);
          } else if (key === 'cmd+f') {
            setIsSearchOpen(true);
            e.preventDefault();
          } else {
            newSearch = `${tempSearch}${key}`;
            setTempSearch(`${tempSearch}${key}`);
          }

          debouncedSearch(newSearch);
        }}
      /> */}
      {component}
    </>
  );
};

WithKeyboardInput.propTypes = propTypes;

export default WithKeyboardInput;
