import { memo } from 'react';
import { COLUMNS } from '$constants';
import { Col } from './Col';

const ColGroupComponent = () => (
  <colgroup>
    {COLUMNS.map(({ key }) => (
      <Col key={key} colKey={key} />
    ))}
    <col className="w-20 min-w-[80px]" />
  </colgroup>
);

export const ColGroup = memo(ColGroupComponent);
