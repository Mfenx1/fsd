import { memo } from 'react';
import { useColumnWidth } from '../../model';

interface ColProps {
  colKey: string;
}

const ColComponent = ({ colKey }: ColProps) => {
  const width = useColumnWidth(colKey);

  return (
    <col
      key={colKey}
      className="col-resizable"
      style={
        {
          '--col-width': `${width}px`,
          '--col-min-width': '60px',
        } as React.CSSProperties
      }
    />
  );
};

export const Col = memo(ColComponent);