import Form from 'react-bootstrap/Form';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { ISkin } from '../../../interface';

interface ISkinControlButtonSize {
  skin: ISkin,
  controlButtonSize: string,
  setControlButtonSize: Function,
}

const SkinControlButtonSize: FC<ISkinControlButtonSize> = ({ skin, controlButtonSize, setControlButtonSize }) => {
  const radio = (size: string) => (
    <Form.Check
      inline
      disabled={!skin.isEditable}
      label={<FormattedMessage id={`${size}_control_buttons`} />}
      name="group3"
      type="radio"
      id={`${size}ControlButtons`}
      value={size}
      checked={controlButtonSize === size}
      onChange={() => setControlButtonSize(size)}
    />
  );

  return (
    <Form>
      <Form.Group>
        <div key={controlButtonSize} className="mb-3">
          {['small', 'medium', 'large'].map((size) => radio(size))}
        </div>
      </Form.Group>
    </Form>
  );
};

export default SkinControlButtonSize;
