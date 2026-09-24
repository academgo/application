import { defineType, defineField } from "sanity";

export default defineType({
  name: "countriesCompareBlock",
  title: "Countries comparison",
  type: "object",
  description:
    "Таблица сравнения стран. Данные берутся из раздела Country (вкладка Comparison data), здесь задаются только заголовки.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Стоимость обучения", value: "tuitionFrom" },
          { title: "Стоимость жизни", value: "livingCostFrom" },
          { title: "Язык обучения", value: "languageOfStudy" },
          { title: "Виза", value: "visa" },
          { title: "Работа во время учёбы", value: "workRights" },
          { title: "Признание диплома", value: "degreeRecognition" },
          { title: "Медицина на английском", value: "medicineInEnglish" }
        ]
      },
      initialValue: [
        "tuitionFrom",
        "livingCostFrom",
        "languageOfStudy",
        "visa",
        "workRights",
        "degreeRecognition"
      ],
      description: "Какие колонки показывать и в каком порядке"
    }),
    defineField({
      name: "labels",
      title: "Column headings",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "country",
          title: "Country",
          type: "string",
          initialValue: "Страна"
        }),
        defineField({ name: "tuitionFrom", title: "Tuition", type: "string" }),
        defineField({
          name: "livingCostFrom",
          title: "Living cost",
          type: "string"
        }),
        defineField({
          name: "languageOfStudy",
          title: "Language of study",
          type: "string"
        }),
        defineField({ name: "visa", title: "Visa", type: "string" }),
        defineField({
          name: "workRights",
          title: "Work while studying",
          type: "string"
        }),
        defineField({
          name: "degreeRecognition",
          title: "Degree recognition",
          type: "string"
        }),
        defineField({
          name: "medicineInEnglish",
          title: "Medicine in English",
          type: "string"
        }),
        defineField({
          name: "yes",
          title: "Yes",
          type: "string",
          initialValue: "да"
        }),
        defineField({
          name: "no",
          title: "No",
          type: "string",
          initialValue: "нет"
        })
      ]
    }),
    defineField({
      name: "linkLabel",
      title: "Link label",
      type: "string",
      description: "Текст ссылки на страницу страны: «Подробнее»"
    }),
    defineField({
      name: "note",
      title: "Note under the table",
      type: "text",
      rows: 2,
      description: "Например: цены официальные, год прайса указан на странице страны"
    })
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }: { title?: string }) => ({
      title: title || "Сравнение стран",
      subtitle: "Countries comparison"
    })
  }
});
