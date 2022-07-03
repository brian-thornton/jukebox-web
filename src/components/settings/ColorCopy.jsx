import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { PropTypes } from 'prop-types';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';

import { deleteSkin, createSkin } from '../../lib/style-client';
import Item from '../common/Item';
import { Colors } from '../shapes';
import styles from '../styles';
import Button from '../Button';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  colors: Colors.isRequired,
  handleCopyColor: PropTypes.func.isRequired,
};

const ColorCopy = ({
  skin
}) => {
  console.log(skin);
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
    console.log(skin);
    skin[target] = skin[selectedColor];

    deleteSkin(skin.name).then(() => {
      createSkin({
        name: name,
        skin: { isEditable: skin.isEditable, name: name, ...skin },
      }).then(() => { });
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <ListGroup>
            <ListGroupItem onClick={() => setSelectedColor('headerColor')} style={sourceStyle('headerColor')}>Header Color</ListGroupItem>
            <ListGroupItem onClick={() => setSelectedColor('footerColor')} style={sourceStyle('footerColor')}>Footer Color</ListGroupItem>
            <ListGroupItem onClick={() => setSelectedColor('fontColor')} style={sourceStyle('fontColor')}>Font Color</ListGroupItem>
            <ListGroupItem onClick={() => setSelectedColor('backgroundColor')} style={sourceStyle('backgroundColor')}>Background Color</ListGroupItem>
            <ListGroupItem onClick={() => setSelectedColor('buttonBackgroundColor')} style={sourceStyle('buttonBackgroundColor')}>Button Background Color</ListGroupItem>
            <ListGroupItem onClick={() => setSelectedColor('buttonFontColor')} style={sourceStyle('buttonFontColor')}>Button Font Color</ListGroupItem>
            <ListGroupItem onClick={() => setSelectedColor('controlButtonBackgroundColor')} style={sourceStyle('controlButtonBackgroundColor')}>Control Button Background Color</ListGroupItem>
            <ListGroupItem onClick={() => setSelectedColor('controlButtonFontColor')} style={sourceStyle('controlButtonFontColor')}>Control Button Font Color</ListGroupItem>
            <ListGroupItem onClick={() => setSelectedColor('trackBackgroundColor')} style={sourceStyle('trackBackgroundColor')}>Track Background Color</ListGroupItem>
          </ListGroup>
        </Col>
        <Col>
          <ListGroup>
            <ListGroupItem onClick={() => setTarget('headerColor')} style={targetStyle('headerColor')}>Header Color</ListGroupItem>
            <ListGroupItem onClick={() => setTarget('footerColor')} style={targetStyle('footerColor')}>Footer Color</ListGroupItem>
            <ListGroupItem onClick={() => setTarget('fontColor')} style={targetStyle('fontColor')}>Font Color</ListGroupItem>
            <ListGroupItem onClick={() => setTarget('backgroundColor')} style={targetStyle('backgroundColor')}>Background Color</ListGroupItem>
            <ListGroupItem onClick={() => setTarget('buttonBackgroundColor')} style={targetStyle('buttonBackgroundColor')}>Button Background Color</ListGroupItem>
            <ListGroupItem onClick={() => setTarget('buttonFontColor')} style={targetStyle('buttonFontColor')}>Button Font Color</ListGroupItem>
            <ListGroupItem onClick={() => setTarget('controlButtonBackgroundColor')} style={targetStyle('controlButtonBackgroundColor')}>Control Button Background Color</ListGroupItem>
            <ListGroupItem onClick={() => setTarget('controlButtonFontColor')} style={targetStyle('controlButtonFontColor')}>Control Button Font Color</ListGroupItem>
            <ListGroupItem onClick={() => setTarget('trackBackgroundColor')} style={targetStyle('trackBackgroundColor')}>Track Background Color</ListGroupItem>
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
