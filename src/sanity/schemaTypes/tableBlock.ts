import { defineType, defineField } from "sanity";

export default defineType({
  name: "tableBlock",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "columns",
      title: "Column headings",
      type: "array",
      of: [{ type: "string" }],
      description: "Заголовки колонок",
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        {
          type: "object",
          name: "tableRow",
          title: "Row",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [{ type: "string" }],
              description: "Значения ячеек в этой строке",
            }),
          ],
          preview: {
            select: {
              cells: "cells",
            },
            prepare(selection) {
              const preview = (selection.cells as string[]).join(" | ");
              return {
                title: preview.slice(0, 50) + (preview.length > 50 ? "…" : ""),
              };
            },
          },
        },
      ],
      description: "Строки таблицы",
    }),
    defineField({
      name: "marginTop",
      title: "Margin Top",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
      },
    }),
    defineField({
      name: "marginBottom",
      title: "Margin Bottom",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
      },
    }),
  ],
});
