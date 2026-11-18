// schemaTypes/workStepsBlock.ts
import { defineField, defineArrayMember } from "sanity";

/** Иконки берутся из набора в коде — загружать картинки не нужно */
export const WORK_STEP_ICONS = [
  { title: "Консультация (облачко)", value: "chat" },
  { title: "Документ", value: "document" },
  { title: "Зачисление (диплом)", value: "diploma" },
  { title: "Паспорт", value: "passport" },
  { title: "Галочка", value: "check" },
  { title: "Самолёт", value: "plane" },
  { title: "Дом", value: "home" }
];

const workStepsBlock = {
  name: "workStepsBlock",
  title: "Этапы работы",
  type: "object",
  description:
    "Компактная инструкция «как мы работаем». Между шагами идёт бегущая строка с номером и названием шага. Оставьте поля пустыми — страница покажет те же шаги, что на главной; заполните «Шаги» — страница покажет свои.",
  fields: [
    defineField({
      name: "heading",
      title: "Заголовок блока",
      type: "text",
      rows: 2,
      description: "Выводится заголовком второго уровня"
    }),

    defineField({
      name: "steps",
      title: "Шаги",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "workStep",
          fields: [
            defineField({
              name: "number",
              title: "Номер",
              type: "string",
              description: "Попадёт в бегущую строку: «шаг 1»"
            }),
            defineField({
              name: "title",
              title: "Название шага",
              type: "string",
              description: "Тоже попадёт в бегущую строку"
            }),
            defineField({
              name: "icon",
              title: "Иконка",
              type: "string",
              initialValue: "document",
              options: { list: WORK_STEP_ICONS }
            }),
            defineField({
              name: "text",
              title: "Описание",
              type: "text",
              rows: 3,
              description: "Одно-два предложения, не больше"
            }),
            defineField({
              name: "bullets",
              title: "Пункты",
              type: "array",
              of: [{ type: "string" }],
              description: "Короткие строки, по три-четыре на шаг"
            }),
            defineField({
              name: "footnote",
              title: "Подпись в нижней полоске",
              type: "string",
              description:
                "Короткая строка слева от кнопки: срок этапа, условие, что угодно по делу"
            }),
            defineField({
              name: "buttonText",
              title: "Подпись кнопки",
              type: "string",
              description: "Если пусто, кнопки у шага не будет"
            }),
            defineField({
              name: "buttonLink",
              title: "Ссылка кнопки",
              type: "url",
              description:
                "Если пусто, а подпись задана, кнопка ведёт в Telegram по умолчанию",
              validation: Rule => Rule.uri({ scheme: ["http", "https"] })
            })
          ],
          preview: {
            select: { title: "title", subtitle: "number" }
          }
        })
      ],
      validation: Rule =>
        Rule.max(6).warning("Больше шести шагов — это уже не инструкция")
    })
  ],
  preview: {
    select: { heading: "heading", first: "steps.0.title" },
    prepare: (selection: Record<string, unknown>) => ({
      title: "Этапы работы",
      subtitle:
        (selection.heading as string) ||
        (selection.first ? "Свои шаги" : "Шаги — как на главной")
    })
  }
};

export default workStepsBlock;
