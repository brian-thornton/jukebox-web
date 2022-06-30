import styles from '../components/styles';

const supportedFonts = {
  google: {
    families: [
      'Azeret Mono',
      'Audiowide',
      'Black Ops One',
      'Macondo',
      'Roboto Condensed',
      'Oswald',
      'Titillium Web',
      'Bebas Neue',
      'Anton',
      'Josefin Sans',
      'Lobster',
      'Prompt',
      'Cairo',
      'Teko',
      'Architects Daughter',
      'Indie Flower',
      'Balsamiq Sans',
      'Staatliches',
      'Patrick Hand',
      'Permanent Marker',
      'Alfa Slab One',
      'Play',
      'Amatic SC',
      'Cookie',
      'Fredoka One',
      'Righteous',
      'Bangers',
      'Cinzel',
      'Courgette',
      'Luckiest Guy',
      'Jost',
      'Russo One',
      'Orbitron',
      'Press Start 2P',
      'Monoton',
      'Ultra',
      'Rock Salt',
      'Carter One',
      'Unica One',
      'Julius Sans One',
      'Zen Tokyo Zoo',
      'Hanalei',
      'Federant',
      'Snowburst One',
      'Miltonian',
      'Bungee Hairline',
      'Nova Slim',
      'Kumar One Outline',
      'Atomic Age',
      'Emblema One',
      'Zen Dots',
      'Metal Mania',
      'Stalinist One',
      'Londrina Shadow',
      'Trade Winds',
      'Faster One',
      'Codystar',
      'Major Mono Display',
      'Mergim',
      'Turret Road',
      'Rubik Microbe',
      'Wallpoet',
      'Graduate',
      'Goldman',
    ],
  },
};

const buttonProps = (settings) => {
  return {
    style: {
      ...styles.buttonStyle,
      background: settings.styles.buttonBackgroundColor,
      color: settings.styles.fontColor,
      fontFamily: settings.styles.buttonFont,
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
      fontFamily: settings.styles.buttonFont,
    },
  }
};

const modalBodyStyle = (settings) => {
  return {
    background: settings.styles.popupBackgroundColor,
  };
};

const modalHeaderStyle = (settings) => {
  const { styles } = settings;
  const { headerColor } = styles;
  const { backgroundColor } = styles;
  const header = headerColor === 'transparent' ? backgroundColor : headerColor;

  return {
    background: header,
    fontFamily: settings.styles.headerFont,
  };
};

const modalFooterStyle = (settings) => {
  const { styles } = settings;
  const { headerColor } = styles;
  const { backgroundColor } = styles;
  const footer = headerColor === 'transparent' ? backgroundColor : headerColor;

  return {
    background: footer,
  };
};

const modalTitleStyle = (settings) => {
  return {
    color: settings.styles.fontColor,
  }
};

const enabledButton = (settings) => {
  return {
    background: '#7CFC00',
    color: '#000000',
    margin: '5px',
    fontFamily: settings.styles.buttonFont,
  };
}

const disabledButton = (settings) => {
  return {
    background: '#FF0000',
    margin: '5px',
    fontFamily: settings.styles.buttonFont,
  };
};

const card = (settings) => {
  return {
    background: 'transparent',
    borderColor: '#708090',
    color: 'white',
    fontFamily: settings.styles.listFont,
  };
};

export {
  buttonProps,
  card,
  controlButtonProps,
  disabledButton,
  enabledButton,
  modalBodyStyle,
  modalFooterStyle,
  modalHeaderStyle,
  modalTitleStyle,
  supportedFonts,
}
