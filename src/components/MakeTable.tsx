import { FC } from "react";

interface tableValues {
  tableHeader: string[] | null;
  tableYears: string[] | null;
  row: string[] | null;
  items: string[] | null;
}

const MakeTable: FC<tableValues> = ({ tableHeader, tableYears, row, items }) => {
  let count = 0;

  return (
    <>
      {tableYears && row && items && tableHeader && (
        <table>
          <tr>
            <th></th> {/* Empty cell for alignment */}
            {tableHeader.map((header) => {
              return (
                <>
                  <th className="" key={header}>
                    {header}
                  </th>
                  {Array.from({ length: tableYears.length - 1 }).map((_, index) => (
                    <th key={index}></th>
                  ))}
                </>
              );
            })}
          </tr>
          <tr>
            <th></th>
            {tableHeader.map(() =>
              tableYears.map((year) => (
                <th className="border-2 border-black" key={year}>
                  {year}
                </th>
              ))
            )}
            {}
          </tr>

          {row.map((row) => (
            <tr>
              <th className="border-2 border-black" key={row}>
                {row}
              </th>
              {tableHeader.map(() =>
                tableYears.map((year) => {
                  const prevCount = count;
                  count = count + 1;
                  return (
                    <td className="border-2 border-black" key={year}>
                      {items[prevCount]}
                    </td>
                  );
                })
              )}
            </tr>
          ))}
          <tr></tr>
        </table>
      )}
    </>
  );
};

export default MakeTable;
