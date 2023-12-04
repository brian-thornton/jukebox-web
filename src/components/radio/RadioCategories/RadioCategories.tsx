import Container from 'react-bootstrap/Container';
import { FC, useContext } from 'react';
import Row from 'react-bootstrap/Row';

import { SettingsContext } from '../../layout/SettingsProvider';
import Button from '../../Button';
import styles from './RadioCategories.module.css';
import { bigButtons } from '../../../lib/helper/styleHelper';

interface IRadioCategories {
  category: string,
  setCategory: Function,
}

const RadioCategories: FC<IRadioCategories> = ({ category, setCategory }) => {
  const settings = useContext(SettingsContext);
  const { features } = settings;
  const { controlButtonSize } = settings?.styles || {};
  const buttonHeight = (!controlButtonSize || controlButtonSize === 'small') ? '' : 50;
  const fontSize = bigButtons(settings) ? '30px' : '';

  const categories = [
    'Rock', 'Pop', '70s', '80s', '90s', 'Oldies', 'Country', 'Rap', 'Dance',
  ];

  const buttons = (
    <>
      {categories.map(c => (
        <Button
          style={{ fontSize }}
          disabled={features?.isLocked}
          onClick={() => {
            setCategory(c);
          }}
          isSelected={c === category}
          width="100%"
          height={buttonHeight.toString()}
          content={c}
        />
      ))}
    </>
  );

  return (
    <Container fluid className={styles.categoriesContainer}>
      <Row>
        {buttons}
      </Row>
    </Container>
  );
};

export default RadioCategories;
