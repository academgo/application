import { defineField } from "sanity";

const header = {
  name: "header",
  title: "Header",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Header title",
      type: "string"
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image"
    }),
    defineField({
      name: "logoMobile",
      title: "Logo mobile",
      type: "image"
    }),
    defineField({
      name: "logoMobileActive",
      title: "Logo mobile active",
      type: "image"
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "string"
    }),
    defineField({
      name: "navLinks",
      title: "Navigation links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string"
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string"
            }),
            defineField({
              name: "showCountries",
              title: "Show countries menu",
              type: "boolean",
              initialValue: false,
              description:
                "Если включено, под этим пунктом автоматически выводятся все страны из раздела Country со своими ссылками. Ручные Sub links тогда не нужны."
            }),
            defineField({
              name: "subLinks",
              title: "Sub links",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string"
                    }),
                    defineField({
                      name: "description",
                      title: "Description",
                      type: "string",
                      description:
                        "Короткое пояснение под ссылкой в выпадающем меню. Можно оставить пустым"
                    }),
                    defineField({
                      name: "link",
                      title: "Link",
                      type: "string"
                    })
                  ],
                  preview: {
                    select: { title: "label", subtitle: "description" }
                  }
                }
              ]
            })
          ]
        }
      ]
    }),
    defineField({
      name: "ctaLabel",
      title: "Header button",
      type: "string",
      description:
        "Label of the orange button on the right. Opens the messenger popup. Empty — «Оценить шансы» / «Check chances» is used. Not shown on phones"
    }),
    defineField({
      name: "mobileCta",
      title: "Bot card in the mobile menu",
      type: "object",
      description:
        "Card at the bottom of the burger menu, phones only. The Telegram and WhatsApp buttons under it use the links from Contact links below. An empty field falls back to a default text",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          description: "Currently: «Оценить шансы на поступление?»"
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "string",
          description: "Currently: «Напишите нашему боту»"
        })
      ]
    }),
    defineField({
      name: "countriesPromo",
      title: "Countries menu promo",
      type: "object",
      description:
        "Card on the right of the «Учёба за рубежом» mega menu. The fields below follow the same order as on the site. An empty field falls back to a default text, the card does not disappear",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          description: "Currently: «Telegram-бот»"
        }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "text",
          title: "Text",
          type: "text",
          rows: 3
        }),
        defineField({ name: "buttonText", title: "Button text", type: "string" }),
        defineField({
          name: "link",
          title: "Link",
          type: "string",
          description:
            "Empty — the button goes to the Telegram contact from Contact links below"
        }),
        defineField({
          name: "icon",
          title: "Icon",
          type: "image",
          description:
            "Messenger icon next to the label. Empty — taken from the Telegram contact in Contact links below"
        })
      ]
    }),
    defineField({
      name: "contactLinks",
      title: "Contact links",
      type: "array",
      description: "Links to messengers",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string"
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "image"
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string"
            })
          ]
        }
      ]
    }),
    defineField({
      name: "workingHours",
      title: "Working hours",
      type: "string"
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone number",
      type: "string",
      description: "Only numbers with spaces and special characters"
    }),
    defineField({
      name: "languageIcon",
      title: "Language icon",
      type: "image",
      description: "Icon for language switcher"
    }),
    defineField({
      name: "languageLink",
      title: "Language link",
      type: "string",
      description: "Link to language switcher"
    }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "id",
      readOnly: true
    })
  ]
};

export default header;
