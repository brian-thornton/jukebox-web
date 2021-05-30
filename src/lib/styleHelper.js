import styles from '../components/styles';

const buttonProps = (settings) => {
  return {
    style: {
      ...styles.buttonStyle,
      background: settings.styles.buttonBackgroundColor,
      color: settings.styles.fontColor,
    },
    variant: 'outline-light',
    className: 'float-right',
  }
};

const controlButtonProps = (settings) => {
  return {
    block: true,
    variant: 'outline-light',
    style: {
      background: settings.styles.buttonBackgroundColor,
      color: settings.styles.fontColor,
      minHeight: '65px',
    },
  }
};

const modalBodyStyle = (settings) => {
  return {
    background: settings.styles.popupBackgroundColor,
  };
};

const modalHeaderStyle = (settings) => {
  return {
    background: settings.styles.headerColor,
  };
};

const modalFooterStyle = (settings) => {
  return {
    background: settings.styles.headerColor,
  };
};

const modalTitleStyle = (settings) => {
  return {
    color: settings.styles.fontColor,
  }
};

export {
  buttonProps,
  controlButtonProps,
  modalBodyStyle,
  modalFooterStyle,
  modalHeaderStyle,
  modalTitleStyle,
}
