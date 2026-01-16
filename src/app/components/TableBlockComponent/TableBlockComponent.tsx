import React from "react";
import styles from "./TableBlockComponent.module.scss";
import { TableBlock } from "@/types/blog";

interface Props {
  block: TableBlock;
}

const marginValues: Record<string, string> = {
  small: "clamp(0.625rem, 2.5vw, 1.875rem)",
  medium: "clamp(1.25rem, 0.5rem + 3vw, 2.75rem)",
  large: "clamp(1.25rem, 5vw, 3.75rem)",
};

const TableBlockComponent: React.FC<Props> = ({ block }) => {
  const computedMarginTop =
    block.marginTop && marginValues[block.marginTop]
      ? marginValues[block.marginTop]
      : "0";

  const computedMarginBottom =
    block.marginBottom && marginValues[block.marginBottom]
      ? marginValues[block.marginBottom]
      : "0";

  return (
    <div
      className={styles.tableBlockComponent}
      style={{
        marginTop: computedMarginTop,
        marginBottom: computedMarginBottom,
      }}
    >
      <div className="container">
        <table className={styles.table}>
          <thead>
            <tr>
              {block.columns.map((col, i) => (
                <th key={i} className={styles.th}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row._key}>
                {row.cells.map((cell, j) => (
                  <td key={j} className={styles.td}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableBlockComponent;
