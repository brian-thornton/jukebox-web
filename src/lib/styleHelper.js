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

export {
  buttonProps
}
