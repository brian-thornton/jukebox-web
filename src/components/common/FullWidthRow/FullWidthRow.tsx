import Col from 'react-bootstrap/Col';
import { FC } from 'react';
import Row from 'react-bootstrap/Row';

interface IFullWidthRow {
  children: any,
  className?: string,
}

const FullWidthRow: FC<IFullWidthRow> = ({ children, className }) => (
  <Row className={className} style={{width: '100%', paddingLeft: '0', paddingRight: '0', marginRight: '0', marginLeft: '0'}}>
    <Col lg="12" xl="12" md="12" sm="12" style={{paddingLeft: '0', paddingRight: '0', marginRight: '0', marginLeft: '0'}}>
      {children}
    </Col>
  </Row>
);

export default FullWidthRow;
