import { defineField } from "sanity";

const country = {
  name: "country",
  title: "Country",
  type: "document",
  description:
    "Страна обучения. Управляет мега-меню, блоком стран на главной и страницей сравнения.",
  fields: [
    defineField({
      name: "title",
      title: "Country name",
      type: "string",
      description: "Название на языке документа: «Турция» / «Turkey»"
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      description:
        "Единый код страны для обеих локалей: turkey, uae, malaysia, italy, spain, hungary, georgia, north-cyprus, south-cyprus, poland",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "flag",
      title: "Flag",
      type: "image",
      description: "Иконка флага для меню и блока стран"
    }),
    defineField({
      name: "hubPage",
      title: "Hub page",
      type: "reference",
      to: [{ type: "singlepage" }],
      description: "Хаб страны — страница «Учёба в …»"
    }),
    defineField({
      name: "menuLinks",
      title: "Menu links",
      type: "array",
      description: "Что показывать под страной в мега-меню (3–6 ссылок)",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
              description:
                "Короткое пояснение под ссылкой в мега-меню: «Бакалавриат и магистратура». Можно оставить пустым"
            }),
            defineField({
              name: "page",
              title: "Page",
              type: "reference",
              to: [{ type: "subpage" }, { type: "singlepage" }]
            })
          ],
          preview: { select: { title: "label", subtitle: "description" } }
        }
      ]
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      description:
        "Короткая подпись рядом со страной в мега-меню: «Топ выбор», «Переезд и ВНЖ». Пустое поле — бейдж не выводится"
    }),
    defineField({
      name: "homeBadge",
      title: "Home badge",
      type: "string",
      description:
        "Плашка поверх фото в блоке «Направления» на главной. Максимум два слова: «ВНЖ и работа», «Топ выбор». Длиннее — ломается на две строки и закрывает треть фото. Это отдельный текст от короткого Badge для мега-меню. Пустое поле — плашка не выводится"
    }),
    defineField({
      name: "homePrice",
      title: "Home price",
      type: "string",
      description:
        "Цена на карточке в блоке «Направления» на главной, строго одной короткой строкой: «от €1 500 в год» или «€1 200–8 200 в год». Поле отдельное от «Стоимость обучения» в блоке сравнения, потому что там цена длиннее и с деталями. Пустое — на карточку подставится «Стоимость обучения»"
    }),
    defineField({
      name: "homeOrder",
      title: "Home order",
      type: "number",
      description:
        "Порядок в плитке «Направления» на главной. Нужен, чтобы порядок на главной не зависел от порядка в мега-меню. Пустое поле — страна встаёт после тех, у кого порядок задан, по общему полю Order",
      validation: Rule => Rule.min(1)
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Порядок в меню и в блоке стран"
    }),
    defineField({
      name: "isFeatured",
      title: "Show on homepage",
      type: "boolean",
      initialValue: true
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "string",
      description: "1 предложение для карточки страны на главной"
    }),
    defineField({
      name: "comparison",
      title: "Comparison data",
      type: "object",
      description: "Строка страны в таблице сравнения стран",
      fields: [
        defineField({
          name: "tuitionFrom",
          title: "Tuition from",
          type: "string",
          description: "Например: «от $4 000 в год»"
        }),
        defineField({
          name: "livingCostFrom",
          title: "Living cost from",
          type: "string",
          description: "Например: «от $700 в месяц»"
        }),
        defineField({
          name: "languageOfStudy",
          title: "Language of study",
          type: "string"
        }),
        defineField({
          name: "visa",
          title: "Visa",
          type: "string",
          description: "Коротко: виза или безвиз, тип разрешения"
        }),
        defineField({
          name: "workRights",
          title: "Work while studying",
          type: "string"
        }),
        defineField({
          name: "degreeRecognition",
          title: "Degree recognition",
          type: "string",
          description: "Честная короткая формулировка по признанию диплома"
        }),
        defineField({
          name: "medicineInEnglish",
          title: "Medicine in English",
          type: "boolean"
        })
      ]
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ],
  preview: {
    select: { title: "title", subtitle: "code", media: "flag" }
  }
};

export default country;
