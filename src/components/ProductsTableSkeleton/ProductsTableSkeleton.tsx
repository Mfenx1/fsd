import { memo } from 'react';
import { COLUMNS, DEFAULT_WIDTHS, ROW_HEIGHT } from '$constants';

const ROWS = 12;

const ProductsTableSkeletonComponent = () => (
  <div className="
    flex flex-col bg-white h-full min-h-[300px] max-h-[calc(100vh-180px)]
  ">
    <div className="shrink-0 border-b border-gray-200">
      <table className="
        w-full border-separate border-spacing-0 table-fixed [--row-height:48px]
      ">
        <colgroup>
          {COLUMNS.map(({ key }) => (
            <col
              key={key}
              className="col-resizable"
              style={
                {
                  '--col-width': `${DEFAULT_WIDTHS[key] ?? 120}px`,
                  '--col-min-width': '60px',
                } as React.CSSProperties
              }
            />
          ))}
          <col className="w-20 min-w-[80px]" />
        </colgroup>
        <thead>
          <tr>
            {COLUMNS.map(({ key, label }) => (
              <th
                key={key}
                className="
                  col-resizable py-3 px-4 text-left align-middle font-semibold
                  text-sm text-gray-400 bg-white relative
                  [&:not(:first-child)]:text-center
                "
                scope="col"
              >
                <span className="text-inherit font-inherit">{label}</span>
              </th>
            ))}
            <th className="
              w-20 min-w-[80px] py-3 px-4 text-left align-middle font-semibold
              text-sm text-gray-400 bg-white relative
            " />
          </tr>
        </thead>
      </table>
    </div>
    <div className="flex-1 min-h-0 overflow-auto table-scroll">
      <table className="
        w-full border-separate border-spacing-0 table-fixed [--row-height:48px]
      ">
        <colgroup>
          {COLUMNS.map(({ key }) => (
            <col
              key={key}
              className="col-resizable"
              style={
                {
                  '--col-width': `${DEFAULT_WIDTHS[key] ?? 120}px`,
                  '--col-min-width': '60px',
                } as React.CSSProperties
              }
            />
          ))}
          <col className="w-20 min-w-[80px]" />
        </colgroup>
        <tbody>
          {Array.from({ length: ROWS }, (_, rowIndex) => (
            <tr
              key={rowIndex}
              className="relative z-0 bg-white"
              style={{
                height: ROW_HEIGHT,
                minHeight: ROW_HEIGHT,
                maxHeight: ROW_HEIGHT,
              }}
            >
              {COLUMNS.map(({ key }) => (
                <td
                  key={key}
                  className="
                    py-3 px-4 text-sm text-gray-900 align-middle bg-white
                    border-b border-gray-200
                    [&:not(:first-child)]:text-center
                  "
                >
                  <div
                    className="cell-skeleton"
                    style={{ width: key === 'title' ? '80%' : key === 'rating' ? '50%' : '65%' }}
                  />
                </td>
              ))}
              <td className="
                py-3 px-4 text-sm text-gray-900 align-middle bg-white border-b
                border-gray-200
              " />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const ProductsTableSkeleton = memo(ProductsTableSkeletonComponent);
