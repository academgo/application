import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "barChartBlock",
  title: "Bar chart",
  type: "object",
  description:
    "Горизонтальные столбики: цены программ, разбивка бюджета, сравнение вузов или стран. Все значения — в одной единице.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "Что и в чём измеряется: «USD за учебный год»"
    }),
    defineField({
      name: "items",
      title: "Bars",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({
              name: "value",
              title: "Value",
              type: "number",
              description: "Длина столбика. Для диапазона — нижняя граница"
            }),
            defineField({
              name: "valueMax",
              title: "Value max (optional)",
              type: "number",
              description:
                "Верхняя граница диапазона — рисуется светлым продолжением"
            }),
            defineField({
              name: "valueLabel",
              title: "Value label",
              type: "string",
              description: "Подпись у конца столбика: «$5 900–6 500»"
            }),
            defineField({
              name: "highlight",
              title: "Highlight",
              type: "boolean",
              description: "Выделить оранжевым — не больше одного столбика"
            })
          ],
          preview: { select: { title: "label", subtitle: "valueLabel" } }
        })
      ]
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: "Сноска под графиком: источник, дата, оговорки"
    })
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }: { title?: string }) => ({
      title: title || "График",
      subtitle: "Bar chart"
    })
  }
});
