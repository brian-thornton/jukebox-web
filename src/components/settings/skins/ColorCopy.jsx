import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { PropTypes } from 'prop-types';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';

import { deleteSkin, createSkin } from '../../../lib/style-client';
import { Colors } from '../../shapes';
import Button from '../../Button';
import './ColorCopy.scss';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  colors: Colors.isRequired,
  handleCopyColor: PropTypes.func.isRequired,
};

const ColorCopy = ({
  skin
}) => {
  const [selectedColor, setSelectedColor] = useState();
  const [target, setTarget] = useState();

  const sourceStyle = (key) => {
    const style = {};

    if (skin[key]) {
      if (skin[key].includes('linear-gradient')) {
        style.background = skin[key];
      } else {
        style.backgroundColor = skin[key];
      }
    } else {
      style.background = 'white';
    }

    if (key === selectedColor) {
      style.borderWidth = '3px';
      style.borderColor = 'white';
    }

    return style;
  };

  const targetStyle = (key) => {
    const style = {};

    if (key === target) {
      style.borderWidth = '3px';
      style.borderColor = 'blue';
    }

    return style;
  }

  const saveSkin = (name = skin.name) => {
    skin[target] = skin[selectedColor];

    deleteSkin(skin.name).then(() => {
      createSkin({
        name: name,
        skin: { isEditable: skin.isEditable, name: name, ...skin },
      }).then(() => { });
    });
  };

  const toWords = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const sourceColor = (name) => {
    return <ListGroupItem onClick={() => setSelectedColor(name)} style={sourceStyle(name)}>{toWords(name)}</ListGroupItem>
  };

  const targetColor = (name) => {
    return <ListGroupItem onClick={() => setTarget(name)} style={targetStyle(name)}>{toWords(name)}</ListGroupItem>
  };

  const colors = ['headerColor', 'footerColor', 'fontColor', 'backgroundColor', 'buttonBackgroundColor', 'buttonFontColor',
    'controlButtonBackgroundColor', 'controlButtonFontColor', 'trackBackgroundColor'];

  return (
    <Container fluid>
      <Row>
        <Col>
          <ListGroup>
            {colors.map((c) => sourceColor(c))}
          </ListGroup>
        </Col>
        <Col>
          <ListGroup>
            {colors.map((c) => targetColor(c))}
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Button content="Save" onClick={() => saveSkin()} />
      </Row>
    </Container>
  );
}

ColorCopy.propTypes = propTypes;

export default ColorCopy;
